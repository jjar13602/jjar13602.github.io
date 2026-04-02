import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { CheckCircle2, XCircle, Code2 } from 'lucide-react';

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showAnswer,
}) {
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleSubmit = () => {
    const isCorrect = selectedAnswer === question.correctAnswer;
    onAnswer(isCorrect, selectedAnswer);
  };

  const isAnswered = showAnswer;
  const isCorrect = selectedAnswer === question.correctAnswer;

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    hard: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardDescription className="text-sm">
            Question {questionNumber} of {totalQuestions}
          </CardDescription>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[question.difficulty]}`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="w-5 h-5" />
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {question.code && (
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm font-mono">
              <code>{question.code}</code>
            </pre>
          </div>
        )}

        <RadioGroup
          value={selectedAnswer}
          onValueChange={setSelectedAnswer}
          disabled={isAnswered}
          className="space-y-3"
        >
          {question.options.map((option, index) => {
            const isThisCorrect = option === question.correctAnswer;
            const isThisSelected = option === selectedAnswer;

            return (
              <div
                key={index}
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${
                  isAnswered
                    ? isThisCorrect
                      ? 'border-green-500 bg-green-50'
                      : isThisSelected
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                    : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                }`}
              >
                <RadioGroupItem value={option} id={`option-${index}`} className="mt-1" />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {question.type === 'code-body' ? (
                    <pre className="text-xs font-mono bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                      <code>{option}</code>
                    </pre>
                  ) : (
                    <span className="font-mono text-sm">{option}</span>
                  )}
                </Label>
                {isAnswered && isThisCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                )}
                {isAnswered && isThisSelected && !isThisCorrect && (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                )}
              </div>
            );
          })}
        </RadioGroup>

        {!isAnswered && (
          <Button onClick={handleSubmit} disabled={!selectedAnswer} className="w-full">
            Submit Answer
          </Button>
        )}

        {isAnswered && (
          <div className={`p-4 rounded-lg border-2 ${
            isCorrect ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800">Explanation:</span>
                </>
              )}
            </h4>
            <p className="text-sm text-gray-700">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}