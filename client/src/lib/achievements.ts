
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (progress: any) => boolean;
  points: number;
}

export const achievements: Achievement[] = [
  {
    id: 'first-quiz',
    title: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
    condition: (progress) => progress.quizAttempts >= 1,
    points: 10,
  },
  {
    id: 'perfect-score',
    title: 'Perfect!',
    description: 'Get 100% on a quiz',
    icon: '⭐',
    condition: (progress) => progress.bestScore >= 100,
    points: 50,
  },
  {
    id: 'speed-learner',
    title: 'Speed Learner',
    description: 'View all cards for a name in under 2 minutes',
    icon: '⚡',
    condition: (progress) => progress.timeSpent < 120 && progress.cardsViewed >= 3,
    points: 25,
  },
  {
    id: 'persistent',
    title: 'Keep Going!',
    description: 'Play 5 different names',
    icon: '🌟',
    condition: (allProgress) => Object.keys(allProgress).length >= 5,
    points: 75,
  },
];

export function checkAchievements(progress: any, allProgress: any): Achievement[] {
  return achievements.filter(achievement => {
    if (achievement.id === 'persistent') {
      return achievement.condition(allProgress);
    }
    return achievement.condition(progress);
  });
}
