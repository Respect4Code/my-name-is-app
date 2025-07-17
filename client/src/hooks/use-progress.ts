
import { useLocalStorage } from './use-local-storage';

interface ProgressData {
  [name: string]: {
    cardsViewed: number;
    quizAttempts: number;
    bestScore: number;
    lastPlayed: string;
    timeSpent: number; // in seconds
  };
}

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<ProgressData>('mynameIs_progress', {});

  const updateProgress = (name: string, updates: Partial<ProgressData[string]>) => {
    setProgress(prev => ({
      ...prev,
      [name]: {
        cardsViewed: 0,
        quizAttempts: 0,
        bestScore: 0,
        lastPlayed: new Date().toISOString(),
        timeSpent: 0,
        ...prev[name],
        ...updates,
      }
    }));
  };

  const getProgress = (name: string) => {
    return progress[name] || {
      cardsViewed: 0,
      quizAttempts: 0,
      bestScore: 0,
      lastPlayed: '',
      timeSpent: 0,
    };
  };

  const getLeaderboard = () => {
    return Object.entries(progress)
      .sort(([,a], [,b]) => b.bestScore - a.bestScore)
      .slice(0, 5);
  };

  return {
    updateProgress,
    getProgress,
    getLeaderboard,
    allProgress: progress,
  };
}
