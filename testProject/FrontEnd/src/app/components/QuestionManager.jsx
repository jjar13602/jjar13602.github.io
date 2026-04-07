import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Edit, Trash2, Save, X, AlertTriangle } from 'lucide-react';
import { loadQuestions, saveQuestions, resetToDefaultQuestions } from '../data/questionManager';
import { getAllUsers } from '../utils/userProgress';

export function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [questionStats, setQuestionStats] = useState({});

  useEffect(() => {
    const loadQuestionsData = async () => {
      const loadedQuestions = await loadQuestions();
      setQuestions(loadedQuestions);

      const users = await getAllUsers();
      const stats = {};

      loadedQuestions.forEach(q => {
        stats[q.id] = { correct: 0, total: 0 };
      });

      users.forEach(user => {
        user.attempts?.forEach(attempt => {
          attempt.questions?.forEach(q => {
            const question = loadedQuestions.find(lq => lq.question === q.question);
            if (question && stats[question.id]) {
              stats[question.id].total++;
              if (q.isCorrect) stats[question.id].correct++;
            }
          });
        });
      });

      setQuestionStats(stats);
      setIsLoading(false);
    };

    loadQuestionsData();
  }, []);

  const handleSaveQuestions = async () => {
    try {
      await saveQuestions(questions);
      alert('Questions saved successfully!');
    } catch (error) {
      alert('Error saving questions. Please try again.');
    }
  };

  const handleResetQuestions = async () => {
    if (confirm('Are you sure you want to reset all questions to default? This cannot be undone.')) {
      try {
        await resetToDefaultQuestions();
        const loadedQuestions = await loadQuestions();
        setQuestions(loadedQuestions);
        alert('Questions reset to default!');
      } catch (error) {
        alert('Error resetting questions. Please try again.');
      }
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = questions.filter(q => q.id !== id);
      setQuestions(updatedQuestions);
      await saveQuestions(updatedQuestions);
    }
  };

  const handleAddQuestion = async (question) => {
    const newId = Math.max(...questions.map(q => q.id), 0) + 1;
    const newQuestion = { ...question, id: newId };
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    await saveQuestions(updatedQuestions);
    setIsAddDialogOpen(false);
  };

  const handleUpdateQuestion = async (question) => {
    const updatedQuestions = questions.map(q => q.id === question.id ? question : q);
    setQuestions(updatedQuestions);
    await saveQuestions(updatedQuestions);
    setIsEditDialogOpen(false);
    setEditingQuestion(null);
  };

  const openEditDialog = (question) => {
    setEditingQuestion(question);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="text-center py-12 text-gray-500">Loading questions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Question Bank Management</CardTitle>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Question</DialogTitle>
                  <DialogDescription>Create a new question for the quiz</DialogDescription>
                </DialogHeader>
                <QuestionForm onSave={handleAddQuestion} onCancel={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
            <Button onClick={handleResetQuestions} variant="outline">
              <AlertTriangle className="w-4 h-4 mr-2" />Reset to Default
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Total Questions: <strong>{questions.length}</strong>
          </div>

          <div className="space-y-3">
            {questions.map((question) => (
              <div key={question.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={question.difficulty === 'easy' ? 'default' : question.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                        {question.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {question.type === 'multiple-choice' ? 'Multiple Choice' : 'Code Body'}
                      </Badge>
                      {questionStats[question.id] && questionStats[question.id].total > 0 && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Avg: {Math.round((questionStats[question.id].correct / questionStats[question.id].total) * 100)}%
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium text-gray-900 mb-1">{question.question}</p>
                    {question.code && (
                      <pre className="text-xs bg-gray-900 text-gray-100 p-2 rounded mt-2 overflow-x-auto">
                        <code>{question.code}</code>
                      </pre>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Correct:</strong> <code className="bg-gray-100 px-1 rounded">{question.correctAnswer}</code>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(question)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteQuestion(question.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {editingQuestion && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Question</DialogTitle>
                <DialogDescription>Update the question details</DialogDescription>
              </DialogHeader>
              <QuestionForm
                question={editingQuestion}
                onSave={handleUpdateQuestion}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setEditingQuestion(null);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}

function QuestionForm({ question, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    question || {
      type: 'multiple-choice',
      difficulty: 'medium',
      question: '',
      code: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.question || !formData.correctAnswer || !formData.explanation) {
      alert('Please fill in all required fields');
      return;
    }
    if (!formData.options || formData.options.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }
    if (!formData.options.includes(formData.correctAnswer)) {
      alert('Correct answer must be one of the options');
      return;
    }

    onSave(formData);
  };

  const updateOption = (index, value) => {
    const newOptions = [...(formData.options || ['', '', '', ''])];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...(formData.options || []), ''] });
  };

  const removeOption = (index) => {
    const newOptions = (formData.options || []).filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Question Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
              <SelectItem value="code-body">Code Body</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Question *</Label>
        <Textarea
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          placeholder="Enter the question..."
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Code Snippet (optional)</Label>
        <Textarea
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          placeholder="Enter code snippet if needed..."
          rows={5}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Answer Options *</Label>
          <Button type="button" size="sm" variant="outline" onClick={addOption}>
            <Plus className="w-4 h-4 mr-1" />Add Option
          </Button>
        </div>
        {(formData.options || []).map((option, index) => (
          <div key={index} className="flex gap-2">
            <Textarea
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              rows={2}
              className="font-mono text-sm"
              required
            />
            {(formData.options?.length || 0) > 2 && (
              <Button type="button" size="sm" variant="ghost" onClick={() => removeOption(index)}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Correct Answer *</Label>
        <Select value={formData.correctAnswer} onValueChange={(value) => setFormData({ ...formData, correctAnswer: value })}>
          <SelectTrigger><SelectValue placeholder="Select the correct answer" /></SelectTrigger>
          <SelectContent>
            {(formData.options || [])
              .filter(option => option.trim() !== '')
              .map((option, index) => (
                <SelectItem key={index} value={option}>
                  Option {index + 1}: {option.substring(0, 50)}{option.length > 50 ? '...' : ''}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Explanation *</Label>
        <Textarea
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          placeholder="Explain why this is the correct answer..."
          rows={3}
          required
        />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />Cancel
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />{question ? 'Update' : 'Create'} Question
        </Button>
      </div>
    </form>
  );
}