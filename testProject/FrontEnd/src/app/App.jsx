import { useState, useEffect } from 'react';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { AuthPage } from './components/AuthPage';
import { UserProfile } from './components/UserProfile';
import { AdminDashboard } from './components/AdminDashboard';
import { Settings } from './components/Settings';
import { AttemptHistory } from './components/AttemptHistory';
import { loadQuestions, getRandomQuestions } from './data/questionManager';
import { Button } from './components/ui/button';
import { Code2, BookOpen, PlayCircle, LogOut, Settings as SettingsIcon, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { loadUserData, saveUserData, isAdminUser } from './utils/userProgress';
import { getUserByEmail } from './utils/api';

const QUIZ_QUESTION_COUNT = 10;

export default function App() {
  const [userData, setUserData] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const savedData = await loadUserData();
      if (savedData) {
        if (!savedData.attempts) savedData.attempts = [];
        setUserData(savedData);
      }
      const qs = await loadQuestions();
      setAllQuestions(qs);
      setIsLoadingUser(false);
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (quizStarted) {
      const loadQuiz = async () => {
        const qs = await loadQuestions();
        setAllQuestions(qs);
        const randomQuestions = getRandomQuestions(qs, QUIZ_QUESTION_COUNT);
        setQuestions(randomQuestions);
      };
      loadQuiz();
    }
  }, [quizStarted]);

  const handleLogin = async (loginData) => {
    // Always fetch from backend first to preserve existing stats
    const backendUser = await getUserByEmail(loginData.email);

    if (backendUser) {
      // Existing user — load their real data from the backend
      if (!backendUser.attempts) backendUser.attempts = [];
      setUserData(backendUser);
      localStorage.setItem('quizUserData', JSON.stringify(backendUser));
    } else {
      // Brand new user — create fresh record
      const isAdmin = isAdminUser(loginData.email);
      const newUserData = {
        firstName: loginData.firstName,
        lastName: loginData.lastName,
        email: loginData.email,
        username: loginData.username,
        password: loginData.password,
        totalQuizzesTaken: 0,
        bestScore: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        attempts: [],
        isAdmin,
      };
      setUserData(newUserData);
      await saveUserData(newUserData);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out? Your progress will be saved.')) {
      setUserData(null);
      setQuizStarted(false);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowAnswer(false);
      setQuizCompleted(false);
      setShowSettings(false);
      setShowHistory(false);
    }
  };

  const handleAnswer = (isCorrect, answer) => {
    setShowAnswer(true);
    if (isCorrect) setScore(score + 1);
    setQuizAnswers([...quizAnswers, {
      question: questions[currentQuestionIndex].question,
      selectedAnswer: answer,
      correctAnswer: questions[currentQuestionIndex].correctAnswer,
      isCorrect,
      explanation: questions[currentQuestionIndex].explanation,
    }]);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
    } else {
      if (userData) {
        const percentage = Math.round((score / questions.length) * 100);
        const newAttempt = {
          attemptNumber: userData.totalQuizzesTaken + 1,
          date: new Date().toISOString(),
          score,
          totalQuestions: questions.length,
          percentage,
          questions: quizAnswers,
        };
        const updatedUserData = {
          ...userData,
          totalQuizzesTaken: userData.totalQuizzesTaken + 1,
          bestScore: Math.max(userData.bestScore, percentage),
          totalQuestionsAnswered: userData.totalQuestionsAnswered + questions.length,
          correctAnswers: userData.correctAnswers + score,
          attempts: [...userData.attempts, newAttempt],
        };
        setUserData(updatedUserData);
        await saveUserData(updatedUserData);
      }
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowAnswer(false);
    setQuizCompleted(false);
    setQuizAnswers([]);
  };
  
  const handleDeleteAccount = () => {
  localStorage.removeItem('quizUserData');
  localStorage.removeItem('quizAllUsers');
  setUserData(null);
  setShowSettings(false);
};
  

  const handleSaveSettings = async (updatedData) => {
    if (userData) {
      const emailChanged = userData.email !== updatedData.email;
      const oldEmail = userData.email;
      if (emailChanged) {
        const confirmChange = confirm('Changing your email will update your account. Your progress will be preserved. Continue?');
        if (!confirmChange) return;
      }
      const newUserData = { ...userData, ...updatedData };
      setUserData(newUserData);
      await saveUserData(newUserData, emailChanged ? oldEmail : undefined);
      setShowSettings(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!userData) return <AuthPage onLogin={handleLogin} />;
  if (userData.isAdmin) return <AdminDashboard adminData={userData} onLogout={handleLogout} />;
if (showSettings) return <Settings userData={userData} onSave={handleSaveSettings} onCancel={() => setShowSettings(false)} onDeleteAccount={handleDeleteAccount} />;  if (showHistory) return <AttemptHistory attempts={userData.attempts} onBack={() => setShowHistory(false)} />;

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowHistory(true)} variant="outline" size="sm">
              <History className="w-4 h-4 mr-2" />View History
            </Button>
            <Button onClick={() => setShowSettings(true)} variant="outline" size="sm">
              <SettingsIcon className="w-4 h-4 mr-2" />Settings
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />Logout
            </Button>
          </div>
          <UserProfile userData={userData} />
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-600 p-4 rounded-full">
                  <Code2 className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-4xl mb-2">C Programming Practice Test</CardTitle>
              <CardDescription className="text-lg">Foundation Exam Preparation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />Test Information
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>{QUIZ_QUESTION_COUNT} Random Questions</strong> from a bank of {allQuestions.length} questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Multiple Choice Questions</strong> with code implementations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Instant feedback with detailed explanations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Difficulty levels: Easy, Medium, and Hard</span>
                  </li>
                </ul>
              </div>
              <Button onClick={() => setQuizStarted(true)} className="w-full" size="lg">
                <PlayCircle className="w-5 h-5 mr-2" />Start Practice Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <QuizResults score={score} totalQuestions={questions.length} onRestart={handleRestart} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-4">
        {questions.length === 0 ? (
          <div className="text-center text-lg text-gray-600">Loading questions...</div>
        ) : (
          <>
            <QuizQuestion
              key={currentQuestionIndex}
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              showAnswer={showAnswer}
            />
            {showAnswer && (
              <div className="flex justify-center">
                <Button onClick={handleNextQuestion} size="lg" className="px-8">
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}