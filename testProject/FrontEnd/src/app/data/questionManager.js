import * as api from '../utils/api';

// Shuffle array and select first n elements
export const getRandomQuestions = (questions, count) => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questions.length));
};

// Load questions from backend or use default questions
export const loadQuestions = async () => {
  try {
    const backendQuestions = await api.getQuestions();

    if (backendQuestions && backendQuestions.length > 0) {
      localStorage.setItem('quizQuestions', JSON.stringify(backendQuestions));
      return backendQuestions;
    }

    const defaultQuestions = getDefaultQuestions();
    await api.saveQuestions(defaultQuestions);
    localStorage.setItem('quizQuestions', JSON.stringify(defaultQuestions));
    return defaultQuestions;
  } catch (error) {
    console.error('Error loading questions:', error);
    const stored = localStorage.getItem('quizQuestions');
    if (stored) return JSON.parse(stored);
    return getDefaultQuestions();
  }
};

// Sync version
export const loadQuestionsSync = () => {
  const stored = localStorage.getItem('quizQuestions');
  if (stored) return JSON.parse(stored);
  return getDefaultQuestions();
};

// Save
export const saveQuestions = async (questions) => {
  try {
    await api.saveQuestions(questions);
    localStorage.setItem('quizQuestions', JSON.stringify(questions));
  } catch (error) {
    localStorage.setItem('quizQuestions', JSON.stringify(questions));
    throw error;
  }
};

// Reset
export const resetToDefaultQuestions = async () => {
  try {
    await api.resetQuestions();
    const defaultQuestions = getDefaultQuestions();
    await api.saveQuestions(defaultQuestions);
    localStorage.setItem('quizQuestions', JSON.stringify(defaultQuestions));
  } catch (error) {
    const defaultQuestions = getDefaultQuestions();
    localStorage.setItem('quizQuestions', JSON.stringify(defaultQuestions));
    throw error;
  }
};

// Default questions (unchanged)
const getDefaultQuestions = () => [
  // KEEP YOUR QUESTIONS ARRAY EXACTLY AS IS
];