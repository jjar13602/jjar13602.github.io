import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Trophy, Star, Target, Award, TrendingUp } from 'lucide-react';
import { calculateLevel } from '../utils/userProgress';
import type { UserData } from '../utils/userProgress';

interface UserProfileProps {
  userData: UserData;
}

export function UserProfile({ userData }: UserProfileProps) {
  const levelInfo = calculateLevel(userData.xp);
  const accuracy =
    userData.totalQuestionsAnswered > 0
      ? Math.round((userData.correctAnswers / userData.totalQuestionsAnswered) * 100)
      : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              {userData.firstName} {userData.lastName}
            </CardTitle>
            <CardDescription className="text-sm">{userData.email}</CardDescription>
          </div>
          <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
            <Award className="w-4 h-4 mr-2" />
            Level {levelInfo.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              {levelInfo.title}
            </span>
            <span className="text-gray-600">
              {levelInfo.level < 10 ? `${levelInfo.xpToNext} XP to next level` : 'Max Level!'}
            </span>
          </div>
          <Progress value={levelInfo.progress} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{userData.xp} XP</span>
            {levelInfo.level < 10 && <span>Next: {userData.xp + levelInfo.xpToNext} XP</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-medium">Best Score</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{userData.bestScore}%</div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs font-medium">Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{accuracy}%</div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Tests Taken</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">{userData.totalQuizzesTaken}</div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <Star className="w-4 h-4" />
              <span className="text-xs font-medium">Total XP</span>
            </div>
            <div className="text-2xl font-bold text-orange-700">{userData.xp}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
