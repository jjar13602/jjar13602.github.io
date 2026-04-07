import 'dotenv/config';
import bcrypt from 'bcrypt';
import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── MongoDB Connection ────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'quiz_app';

let db;

async function connectDB() {
  const client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  db = client.db(DB_NAME);
  console.log('✅ Connected to MongoDB Atlas');
}

// ─── Auth Middleware ──────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.use(authMiddleware);

// ─── Audit Log Helper ─────────────────────────────────────────────────────────
async function logAction(email, action, details = {}) {
  try {
    await db.collection('audit_log').insertOne({ email, action, details, timestamp: new Date() });
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
}

// ─── Helper: assemble full user from 3 collections ───────────────────────────
async function getFullUser(email) {
  const [account, stats, meta] = await Promise.all([
    db.collection('user_accounts').findOne({ email }),
    db.collection('user_stats').findOne({ email }),
    db.collection('user_meta').findOne({ email }),
  ]);
  if (!account) return null;
  const { _id: _a, ...accountData } = account;
  const { _id: _s, email: _se, ...statsData } = stats || { attempts: [], totalQuizzesTaken: 0, bestScore: 0, totalQuestionsAnswered: 0, correctAnswers: 0 };
  const { _id: _m, email: _me, ...metaData } = meta || { createdAt: null, updatedAt: null };
  return { ...accountData, ...statsData, ...metaData };
}

// ─── USER ROUTES ──────────────────────────────────────────────────────────────

app.get('/users/check-email/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase();
    const account = await db.collection('user_accounts').findOne({ email });
    res.json({ exists: !!account });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    const userData = req.body;
    userData.email = userData.email.toLowerCase();

    const existing = await db.collection('user_accounts').findOne({
      $or: [{ email: userData.email }, { username: userData.username }]
    });

    if (existing) {
      if (existing.email === userData.email) return res.status(409).json({ success: false, error: 'Email already registered' });
      return res.status(409).json({ success: false, error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const now = new Date();

    await db.collection('user_accounts').insertOne({
      email: userData.email, firstName: userData.firstName, lastName: userData.lastName,
      username: userData.username, password: hashedPassword, isAdmin: userData.isAdmin || false,
    });
    await db.collection('user_stats').insertOne({
      email: userData.email, totalQuizzesTaken: 0, bestScore: 0,
      totalQuestionsAnswered: 0, correctAnswers: 0, attempts: [],
    });
    await db.collection('user_meta').insertOne({ email: userData.email, createdAt: now, updatedAt: now });
    await logAction(userData.email, 'register', { username: userData.username });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const account = await db.collection('user_accounts').findOne({
      $or: [{ username }, { email: username.toLowerCase() }]
    });

    if (!account) return res.json({ success: false, error: 'Invalid username or password' });

    const passwordMatch = await bcrypt.compare(password, account.password);
    if (!passwordMatch) {
      await logAction(account.email, 'login_failed', {});
      return res.json({ success: false, error: 'Invalid username or password' });
    }

    await logAction(account.email, 'login', {});
    const user = await getFullUser(account.email);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/users/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase();
    const user = await getFullUser(email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const accounts = await db.collection('user_accounts').find({}).toArray();
    const users = await Promise.all(accounts.map(a => getFullUser(a.email)));
    res.json(users.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const userData = req.body;
    userData.email = userData.email.toLowerCase();
    const now = new Date();

    const accountUpdate = {
      firstName: userData.firstName, lastName: userData.lastName,
      username: userData.username, isAdmin: userData.isAdmin || false,
    };
    if (userData.password && !userData.password.startsWith('$2b$')) {
      accountUpdate.password = await bcrypt.hash(userData.password, 10);
    }
    await db.collection('user_accounts').updateOne({ email: userData.email }, { $set: accountUpdate }, { upsert: true });
    await db.collection('user_stats').updateOne(
      { email: userData.email },
      { $set: {
        totalQuizzesTaken: userData.totalQuizzesTaken ?? 0,
        bestScore: userData.bestScore ?? 0,
        totalQuestionsAnswered: userData.totalQuestionsAnswered ?? 0,
        correctAnswers: userData.correctAnswers ?? 0,
        attempts: userData.attempts ?? [],
      }},
      { upsert: true }
    );
    await db.collection('user_meta').updateOne(
      { email: userData.email },
      { $set: { updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true }
    );

    // ─── Many-to-many: update user_question_stats on quiz save ───────────────
    if (userData.attempts && userData.attempts.length > 0) {
      const latestAttempt = userData.attempts[userData.attempts.length - 1];
      if (latestAttempt?.questions) {
        for (const q of latestAttempt.questions) {
          await db.collection('user_question_stats').updateOne(
            { email: userData.email, questionText: q.question },
            {
              $inc: { timesAttempted: 1, timesCorrect: q.isCorrect ? 1 : 0 },
              $set: { lastAttempted: new Date() },
              $setOnInsert: { email: userData.email, questionText: q.question },
            },
            { upsert: true }
          );
        }
      }
    }

    await logAction(userData.email, 'profile_updated', {});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/users/:oldEmail', async (req, res) => {
  try {
    const oldEmail = decodeURIComponent(req.params.oldEmail).toLowerCase();
    const userData = req.body;
    userData.email = userData.email.toLowerCase();
    const now = new Date();

    const accountUpdate = {
      email: userData.email, firstName: userData.firstName, lastName: userData.lastName,
      username: userData.username, isAdmin: userData.isAdmin || false,
    };
    if (userData.password && !userData.password.startsWith('$2b$')) {
      accountUpdate.password = await bcrypt.hash(userData.password, 10);
    }

    await db.collection('user_accounts').updateOne({ email: oldEmail }, { $set: accountUpdate }, { upsert: true });
    await db.collection('user_stats').updateOne(
      { email: oldEmail },
      { $set: {
        email: userData.email, totalQuizzesTaken: userData.totalQuizzesTaken ?? 0,
        bestScore: userData.bestScore ?? 0, totalQuestionsAnswered: userData.totalQuestionsAnswered ?? 0,
        correctAnswers: userData.correctAnswers ?? 0, attempts: userData.attempts ?? [],
      }},
      { upsert: true }
    );
    await db.collection('user_meta').updateOne({ email: oldEmail }, { $set: { email: userData.email, updatedAt: now } }, { upsert: true });
    await db.collection('user_question_stats').updateMany({ email: oldEmail }, { $set: { email: userData.email } });

    await logAction(userData.email, 'email_changed', { from: oldEmail, to: userData.email });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /users/:email — removes user from ALL collections
app.delete('/users/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase();

    await Promise.all([
      db.collection('user_accounts').deleteOne({ email }),
      db.collection('user_stats').deleteOne({ email }),
      db.collection('user_meta').deleteOne({ email }),
      db.collection('audit_log').deleteMany({ email }),
      db.collection('user_question_stats').deleteMany({ email }),
    ]);

    await logAction('admin', 'user_deleted', { deletedUser: email });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── USER QUESTION STATS (many-to-many) ──────────────────────────────────────

// GET /question-stats — hardest questions across all users (admin)
app.get('/question-stats', async (req, res) => {
  try {
    const stats = await db.collection('user_question_stats').aggregate([
      {
        $group: {
          _id: '$questionText',
          totalAttempts: { $sum: '$timesAttempted' },
          totalCorrect: { $sum: '$timesCorrect' },
          uniqueUsers: { $addToSet: '$email' },
        }
      },
      {
        $project: {
          questionText: '$_id',
          totalAttempts: 1,
          totalCorrect: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          successRate: {
            $cond: [
              { $gt: ['$totalAttempts', 0] },
              { $multiply: [{ $divide: ['$totalCorrect', '$totalAttempts'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { successRate: 1 } }
    ]).toArray();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /question-stats/:email — one user's performance per question
app.get('/question-stats/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase();
    const stats = await db.collection('user_question_stats')
      .find({ email })
      .sort({ timesAttempted: -1 })
      .toArray();
    res.json(stats.map(({ _id, ...s }) => s));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── AUDIT LOG ROUTES ─────────────────────────────────────────────────────────

app.get('/audit-log', async (req, res) => {
  try {
    const logs = await db.collection('audit_log').find({}).sort({ timestamp: -1 }).limit(500).toArray();
    res.json(logs.map(({ _id, ...l }) => l));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/audit-log/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase();
    const logs = await db.collection('audit_log').find({ email }).sort({ timestamp: -1 }).toArray();
    res.json(logs.map(({ _id, ...l }) => l));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── QUESTION ROUTES ──────────────────────────────────────────────────────────

app.get('/questions', async (req, res) => {
  try {
    const questions = await db.collection('questions').find({}).toArray();
    res.json(questions.map(({ _id, ...q }) => q));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/questions', async (req, res) => {
  try {
    const questions = req.body;
    if (!Array.isArray(questions)) return res.status(400).json({ error: 'Expected an array of questions' });
    await db.collection('questions').deleteMany({});
    if (questions.length > 0) await db.collection('questions').insertMany(questions);
    res.json({ success: true, count: questions.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/questions/reset', async (req, res) => {
  try {
    await db.collection('questions').deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── RESOURCES ROUTE ──────────────────────────────────────────────────────────

app.get('/resources', async (req, res) => {
  res.json({
    'Dynamic Memory Allocation': [
      { title: 'C malloc() Tutorial', url: 'https://www.tutorialspoint.com/c_standard_library/c_function_malloc.htm' },
      { title: 'Memory Management in C', url: 'https://www.geeksforgeeks.org/dynamic-memory-allocation-in-c-using-malloc-calloc-free-and-realloc/' }
    ],
    'Recursion': [
      { title: 'C Recursion Tutorial', url: 'https://www.programiz.com/c-programming/c-recursion' },
      { title: 'Recursion Examples', url: 'https://www.geeksforgeeks.org/recursion-in-c/' }
    ],
    'Linked Lists': [
      { title: 'Linked List Basics', url: 'https://www.learn-c.org/en/Linked_lists' },
      { title: 'Linked List Operations', url: 'https://www.geeksforgeeks.org/data-structures/linked-list/' }
    ],
    'Stacks and Queues': [
      { title: 'Stack Implementation in C', url: 'https://www.programiz.com/dsa/stack' },
      { title: 'Queue Implementation in C', url: 'https://www.programiz.com/dsa/queue' }
    ],
    'Algorithm Analysis': [
      { title: 'Time Complexity Analysis', url: 'https://www.programiz.com/dsa/asymptotic-notations' },
      { title: 'Binary Search Tutorial', url: 'https://www.geeksforgeeks.org/binary-search/' }
    ]
  });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Quiz API server running on port ${PORT}`));
}).catch(err => {
  console.error('❌ Failed to connect to MongoDB:', err);
  process.exit(1);
});