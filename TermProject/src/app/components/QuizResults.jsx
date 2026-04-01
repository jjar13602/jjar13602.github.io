import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Trophy, Target, BookOpen, RotateCcw, Sparkles } from 'lucide-react';

export function QuizResults({ score, totalQuestions, xpGained, onRestart }) {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getGrade = () => {
    if (percentage >= 90) return { grade: 'A', message: 'Excellent!', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'B', message: 'Great Job!', color: 'text-blue-600' };
    if (percentage >= 70) return { grade: 'C', message: 'Good Effort!', color: 'text-yellow-600' };
    if (percentage >= 60) return { grade: 'D', message: 'Keep Practicing!', color: 'text-orange-600' };
    return { grade: 'F', message: 'More Practice Needed', color: 'text-red-600' };
  };

  const result = getGrade();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Trophy className="w-16 h-16 text-yellow-500" />
        </div>
        <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
        <CardDescription>Here are your results</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-lg font-semibold text-purple-900">XP Gained</span>
          </div>
          <div className="text-4xl font-bold text-purple-700">+{xpGained} XP</div>
        </div>

        <div className="text-center space-y-2">
          <div className={`text-6xl font-bold ${result.color}`}>{result.grade}</div>
          <p className="text-xl font-semibold">{result.message}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Your Score</span>
            <span className="font-semibold">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{score}</div>
            <div className="text-sm text-green-600">Correct</div>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
            <BookOpen className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700">{totalQuestions - score}</div>
            <div className="text-sm text-red-600">Incorrect</div>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Study Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Review C syntax and data types thoroughly</li>
            <li>Practice pointer operations and memory management</li>
            <li>Understand control structures (loops, conditionals)</li>
            <li>Master array and string manipulation</li>
            <li>Study function declarations and definitions</li>
          </ul>
        </div>

        <Button onClick={onRestart} className="w-full" size="lg">
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake Quiz
        </Button>
      </CardContent>
    </Card>
  );
}