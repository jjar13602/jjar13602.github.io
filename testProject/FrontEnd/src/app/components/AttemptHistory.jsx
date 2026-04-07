import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, Calendar, Award, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
 
export function AttemptHistory({ attempts, onBack }) {
  const [selectedAttempt, setSelectedAttempt] = useState(null);
 
  if (selectedAttempt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Button onClick={() => setSelectedAttempt(null)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />Back to Attempts
          </Button>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attempt #{selectedAttempt.attemptNumber}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />{new Date(selectedAttempt.date).toLocaleString()}
                  </CardDescription>
                </div>
                <Badge className={`text-lg px-4 py-2 ${
                  selectedAttempt.percentage >= 70 ? 'bg-green-600' :
                  selectedAttempt.percentage >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                }`}>{selectedAttempt.percentage}%</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Score</div>
                <div className="text-2xl font-bold">{selectedAttempt.score} / {selectedAttempt.totalQuestions}</div>
              </div>
              <div className="space-y-3">
                {selectedAttempt.questions.map((q, idx) => (
                  <Card key={idx} className={`border-2 ${q.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        {q.isCorrect
                          ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                          : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />}
                        <div className="flex-1">
                          <CardTitle className="text-base">Question {idx + 1}</CardTitle>
                          <CardDescription className="mt-1">{q.question}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Your Answer: </span>
                        <span className={q.isCorrect ? 'text-green-700' : 'text-red-700'}>{q.selectedAnswer}</span>
                      </div>
                      {!q.isCorrect && (
                        <div>
                          <span className="font-semibold">Correct Answer: </span>
                          <span className="text-green-700">{q.correctAnswer}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-gray-200">
                        <span className="font-semibold">Explanation: </span>
                        <span className="text-gray-700">{q.explanation}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Home
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-600" />Quiz Attempt History
            </CardTitle>
            <CardDescription>Review your past quiz attempts and see where you can improve</CardDescription>
          </CardHeader>
          <CardContent>
            {attempts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No quiz attempts yet. Take your first quiz to see your history here!
              </div>
            ) : (
              <div className="space-y-3">
                {attempts.slice().reverse().map((attempt) => (
                  <Card key={attempt.attemptNumber}
                    className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-blue-300"
                    onClick={() => setSelectedAttempt(attempt)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="font-semibold text-lg">Attempt #{attempt.attemptNumber}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(attempt.date).toLocaleDateString()} at {new Date(attempt.date).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold">{attempt.percentage}%</div>
                            <div className="text-sm text-gray-600">{attempt.score}/{attempt.totalQuestions}</div>
                          </div>
                          <Badge className={`${attempt.percentage >= 70 ? 'bg-green-600' : attempt.percentage >= 50 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                            {attempt.percentage >= 70 ? 'Pass' : 'Fail'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}