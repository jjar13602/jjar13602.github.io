export const LEVEL_THRESHOLDS = [
  { level: 1, xpRequired: 0, title: 'Beginner' },
  { level: 2, xpRequired: 100, title: 'Novice Coder' },
  { level: 3, xpRequired: 250, title: 'Apprentice' },
  { level: 4, xpRequired: 450, title: 'Intermediate' },
  { level: 5, xpRequired: 700, title: 'Advanced Coder' },
  { level: 6, xpRequired: 1000, title: 'Expert' },
  { level: 7, xpRequired: 1400, title: 'Master' },
  { level: 8, xpRequired: 1900, title: 'Grandmaster' },
  { level: 9, xpRequired: 2500, title: 'Legend' },
  { level: 10, xpRequired: 3200, title: 'C Programming God' },
];

export const calculateLevel = (xp) => {
  let currentLevel = LEVEL_THRESHOLDS[0];
  let nextLevel = LEVEL_THRESHOLDS[1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i].xpRequired) {
      currentLevel = LEVEL_THRESHOLDS[i];
      nextLevel = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i];
    } else {
      break;
    }
  }

  const xpInCurrentLevel = xp - currentLevel.xpRequired;
  const xpNeededForNext = nextLevel.xpRequired - currentLevel.xpRequired;
  const progress = Math.min(100, (xpInCurrentLevel / xpNeededForNext) * 100);

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    xpToNext: nextLevel.xpRequired - xp,
    progress: isNaN(progress) ? 100 : progress,
  };
};

export const calculateXPGain = (score, totalQuestions) => {
  const baseXP = 10;
  const correctAnswerXP = 15;
  const bonusXP = score === totalQuestions ? 50 : 0;

  return baseXP + (score * correctAnswerXP) + bonusXP;
};

export const saveUserData = async (_userData) => {
};

export const loadUserData = async () => {
  return null;
};

export const clearUserData = () => {
};