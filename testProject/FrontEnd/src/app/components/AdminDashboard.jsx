import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Users, Trophy, Target, TrendingUp, LogOut, BarChart3,
  CheckCircle2, XCircle, BookOpen, Trash2, AlertTriangle
} from 'lucide-react';
import { getAllUsers } from '../utils/userProgress';
import { QuestionManager } from './QuestionManager';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_KEY = import.meta.env.VITE_API_KEY || 'your-secret-api-key';

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `Request failed: ${response.statusText}`);
  }
  return response.json();
}

export function AdminDashboard({ adminData, onLogout }) {
  const [allUsers, setAllUsers] = useState([]);
  const [questionStats, setQuestionStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingEmail, setDeletingEmail] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [users, stats] = await Promise.all([
      getAllUsers(),
      apiRequest('/question-stats').catch(() => []),
    ]);
    setAllUsers(users.filter(u => !u.isAdmin));
    setQuestionStats(stats);
    setIsLoading(false);
  };

  const handleDeleteUser = async (email, name) => {
    if (!confirm(`Are you sure you want to permanently delete ${name}? This cannot be undone.`)) return;

    setDeletingEmail(email);
    try {
      await apiRequest(`/users/${encodeURIComponent(email)}`, { method: 'DELETE' });
      setAllUsers(prev => prev.filter(u => u.email !== email));
    } catch (err) {
      alert(`Failed to delete user: ${err.message}`);
    }
    setDeletingEmail(null);
  };

  const totalStudents = allUsers.length;
  const totalQuizzes = allUsers.reduce((sum, user) => sum + user.totalQuizzesTaken, 0);
  const totalQuestions = allUsers.reduce((sum, user) => sum + user.totalQuestionsAnswered, 0);
  const totalCorrect = allUsers.reduce((sum, user) => sum + user.correctAnswers, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const averageScore = allUsers.length > 0
    ? Math.round(allUsers.reduce((sum, user) => sum + user.bestScore, 0) / allUsers.length)
    : 0;

  const sortedUsers = [...allUsers].sort((a, b) => b.bestScore - a.bestScore);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {adminData.firstName} {adminData.lastName}</p>
          </div>
          <Button onClick={onLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />Logout
          </Button>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="students"><Users className="w-4 h-4 mr-2" />Students</TabsTrigger>
            <TabsTrigger value="question-stats"><BarChart3 className="w-4 h-4 mr-2" />Question Stats</TabsTrigger>
            <TabsTrigger value="questions"><BookOpen className="w-4 h-4 mr-2" />Questions</TabsTrigger>
          </TabsList>

          {/* ─── Students Tab ─────────────────────────────────────────────── */}
          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div><p className="text-blue-100 text-sm font-medium">Total Students</p><p className="text-3xl font-bold mt-2">{totalStudents}</p></div>
                    <Users className="w-12 h-12 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div><p className="text-green-100 text-sm font-medium">Tests Completed</p><p className="text-3xl font-bold mt-2">{totalQuizzes}</p></div>
                    <BarChart3 className="w-12 h-12 text-green-200" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div><p className="text-purple-100 text-sm font-medium">Avg. Best Score</p><p className="text-3xl font-bold mt-2">{averageScore}%</p></div>
                    <Trophy className="w-12 h-12 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div><p className="text-orange-100 text-sm font-medium">Overall Accuracy</p><p className="text-3xl font-bold mt-2">{overallAccuracy}%</p></div>
                    <Target className="w-12 h-12 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {sortedUsers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-green-50 border-2 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">Excellent (80%+)</span>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-700">{sortedUsers.filter(u => u.bestScore >= 80).length}</p>
                    <p className="text-xs text-green-600 mt-1">{Math.round((sortedUsers.filter(u => u.bestScore >= 80).length / sortedUsers.length) * 100)}% of students</p>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-50 border-2 border-yellow-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-yellow-800">Good (60-79%)</span>
                      <TrendingUp className="w-5 h-5 text-yellow-600" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-700">{sortedUsers.filter(u => u.bestScore >= 60 && u.bestScore < 80).length}</p>
                    <p className="text-xs text-yellow-600 mt-1">{Math.round((sortedUsers.filter(u => u.bestScore >= 60 && u.bestScore < 80).length / sortedUsers.length) * 100)}% of students</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 border-2 border-red-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-red-800">Needs Help (&lt;60%)</span>
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold text-red-700">{sortedUsers.filter(u => u.bestScore < 60).length}</p>
                    <p className="text-xs text-red-600 mt-1">{Math.round((sortedUsers.filter(u => u.bestScore < 60).length / sortedUsers.length) * 100)}% of students</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-600" />Student Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sortedUsers.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No students have taken the test yet</p>
                    <p className="text-sm mt-2">Student progress will appear here once they start taking quizzes</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Tests</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Best Score</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Accuracy</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedUsers.map((user, index) => {
                          const accuracy = user.totalQuestionsAnswered > 0
                            ? Math.round((user.correctAnswers / user.totalQuestionsAnswered) * 100) : 0;
                          return (
                            <tr key={user.email} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                                  {index === 1 && <Trophy className="w-5 h-5 text-gray-400" />}
                                  {index === 2 && <Trophy className="w-5 h-5 text-orange-600" />}
                                  <span className="font-semibold text-gray-700">#{index + 1}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                              <td className="py-4 px-4 text-center">
                                <span className="font-medium text-gray-700">{user.totalQuizzesTaken}</span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  {user.bestScore >= 80 ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    : user.bestScore >= 60 ? <TrendingUp className="w-4 h-4 text-yellow-600" />
                                    : <XCircle className="w-4 h-4 text-red-600" />}
                                  <span className={`font-semibold ${user.bestScore >= 80 ? 'text-green-700' : user.bestScore >= 60 ? 'text-yellow-700' : 'text-red-700'}`}>
                                    {user.bestScore}%
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className={`font-semibold ${accuracy >= 80 ? 'text-green-700' : accuracy >= 60 ? 'text-yellow-700' : 'text-red-700'}`}>
                                  {accuracy}%
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={deletingEmail === user.email}
                                  onClick={() => handleDeleteUser(user.email, `${user.firstName} ${user.lastName}`)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Question Stats Tab (Many-to-Many) ───────────────────────── */}
          <TabsContent value="question-stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />Question Difficulty Rankings
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">Based on success rates across all student attempts — hardest first</p>
              </CardHeader>
              <CardContent>
                {questionStats.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No question data yet</p>
                    <p className="text-sm mt-2">Stats will appear once students start taking quizzes</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {questionStats.map((stat, index) => {
                      const rate = Math.round(stat.successRate);
                      const color = rate >= 70 ? 'bg-green-500' : rate >= 40 ? 'bg-yellow-500' : 'bg-red-500';
                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <p className="text-sm font-medium text-gray-900 flex-1">{stat.questionText}</p>
                            <div className="text-right shrink-0">
                              <span className={`text-sm font-bold ${rate >= 70 ? 'text-green-700' : rate >= 40 ? 'text-yellow-700' : 'text-red-700'}`}>
                                {rate}% success
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${rate}%` }} />
                          </div>
                          <div className="flex gap-4 text-xs text-gray-500">
                            <span>{stat.totalAttempts} attempts</span>
                            <span>{stat.uniqueUsers} students</span>
                            <span>{stat.totalCorrect} correct</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Questions Tab ────────────────────────────────────────────── */}
          <TabsContent value="questions">
            <QuestionManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}