import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Target, TrendingUp, Award } from 'lucide-react';
 
export function UserProfile({ userData }) {
  const accuracy = userData.totalQuestionsAnswered > 0
    ? Math.round((userData.correctAnswers / userData.totalQuestionsAnswered) * 100)
    : 0;
 
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{userData.firstName} {userData.lastName}</CardTitle>
            <CardDescription className="text-sm">{userData.email}</CardDescription>
          </div>
          <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
            <Award className="w-4 h-4 mr-2" />
            {userData.totalQuizzesTaken} {userData.totalQuizzesTaken === 1 ? 'Quiz' : 'Quizzes'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Trophy className="w-4 h-4" /><span className="text-xs font-medium">Best Score</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{userData.bestScore}%</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Target className="w-4 h-4" /><span className="text-xs font-medium">Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{accuracy}%</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <TrendingUp className="w-4 h-4" /><span className="text-xs font-medium">Tests Taken</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">{userData.totalQuizzesTaken}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}