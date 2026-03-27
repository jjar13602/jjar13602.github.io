import { useState } from 'react';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { LoginPage } from './components/LoginPage';
import { UserProfile } from './components/UserProfile';
import { Button } from './components/ui/button';
import { Code2, BookOpen, PlayCircle, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { calculateXPGain } from './utils/userProgress';
import type { UserData } from './utils/userProgress';

// Placeholder question count for UI — replace with real data from API (Person 2)
const QUESTION_COUNT = 10;

export default function App() {
  // UI state — drives which screen is shown
  const [userData, setUserData] = useState<UserData | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // TEMP: sets dummy user data locally so UX can be tested end-to-end
  // TODO (Person 3 — Auth): Replace with real POST /api/auth/login + JWT storage
  const handleLogin = (loginData: { firstName: string; lastName: string; email: string }) => {
    setUserData({
      firstName: loginData.firstName,
      lastName: loginData.lastName,
      email: loginData.email,
      level: 1,
      xp: 120,
      totalQuizzesTaken: 3,
      bestScore: 80,
      totalQuestionsAnswered: 30,
      correctAnswers: 24,
    });
  };

  // TODO (Person 3 — Auth): Call logout endpoint, clear JWT
  const handleLogout = () => {
    setUserData(null);
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowAnswer(false);
    setQuizCompleted(false);
  };

  // TEMP: tracks score locally for UX testing
  // TODO (Person 2 — Attempts): POST /api/attempts with answer data
  const handleAnswer = (isCorrect: boolean, _answer: string) => {
    setShowAnswer(true);
    if (isCorrect) setScore(prev => prev + 1);
  };

  // TODO (Person 2 — Attempts): Tie into attempt logging; update score locally for now
  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUESTION_COUNT - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowAnswer(false);
    setQuizCompleted(false);
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  // --- Screen: Login ---
  if (!userData) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // --- Screen: Start / Dashboard ---
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
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
              <CardDescription className="text-lg">
                Foundation Exam Preparation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Test Information
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>{QUESTION_COUNT} Questions</strong> covering fundamental C programming concepts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Multiple Choice Questions</strong> with code implementations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Function Body Selection</strong> - choose the correct code to make functions work</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Instant feedback with detailed explanations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Difficulty levels: Easy, Medium, and Hard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Topics: Memory Allocation, Recursion, Linked Lists, Stacks, Queues, Algorithm Analysis</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Tip:</strong> Read each question carefully and analyze the code bodies.
                  Pay attention to syntax, logic, and edge cases when selecting the correct implementation.
                </p>
              </div>

              <Button onClick={handleStartQuiz} className="w-full" size="lg">
                <PlayCircle className="w-5 h-5 mr-2" />
                Start Practice Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- Screen: Results ---
  if (quizCompleted) {
    const xpGained = calculateXPGain(score, QUESTION_COUNT);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <QuizResults
          score={score}
          totalQuestions={QUESTION_COUNT}
          xpGained={xpGained}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  // --- Screen: Question ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-4">
        {/* TODO (Person 2): Pass real question from API instead of placeholder */}
        <QuizQuestion
          question={{
            id: currentQuestionIndex,
            type: 'multiple-choice',
            question: 'Placeholder question — wire up from API (Person 2)',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 'Option A',
            explanation: 'Placeholder explanation.',
            difficulty: 'easy',
          }}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={QUESTION_COUNT}
          onAnswer={handleAnswer}
          showAnswer={showAnswer}
        />

        {showAnswer && (
          <div className="flex justify-center">
            <Button onClick={handleNextQuestion} size="lg" className="px-8">
              {currentQuestionIndex < QUESTION_COUNT - 1 ? 'Next Question' : 'View Results'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}