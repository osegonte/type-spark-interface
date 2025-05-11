
import { SessionData } from '@/context/StatsContext';
import * as api from '@/services/api';

// Flag to determine whether to use API or localStorage
// You can set this based on environment, configuration, or feature flags
const USE_API = false; // Set to true to use your backend API

// Types
interface StatsData {
  sessionHistory: SessionData[];
  averageWpm: number;
  averageAccuracy: number;
  totalPracticeMinutes: number;
  currentStreak: number;
  longestStreak: number;
}

// Get all stats (either from API or localStorage)
export const getStats = async (): Promise<StatsData> => {
  if (USE_API) {
    try {
      // Fetch session history and user stats from API
      const [sessionHistory, stats] = await Promise.all([
        api.fetchSessionHistory(),
        api.fetchUserStats()
      ]);
      
      return {
        sessionHistory,
        ...stats
      };
    } catch (error) {
      console.error('Failed to fetch stats from API:', error);
      // Fallback to localStorage if API fails
      return getStatsFromLocalStorage();
    }
  } else {
    // Use localStorage if API is not enabled
    return getStatsFromLocalStorage();
  }
};

// Save session data (either to API or localStorage)
export const saveSession = async (session: SessionData, currentStats: StatsData): Promise<StatsData> => {
  if (USE_API) {
    try {
      // Save to API
      await api.addSessionData(session);
      
      // Fetch updated stats from API
      const [sessionHistory, stats] = await Promise.all([
        api.fetchSessionHistory(),
        api.fetchUserStats()
      ]);
      
      return {
        sessionHistory,
        ...stats
      };
    } catch (error) {
      console.error('Failed to save session to API:', error);
      // Fallback to localStorage if API fails
      return saveSessionToLocalStorage(session, currentStats);
    }
  } else {
    // Use localStorage if API is not enabled
    return saveSessionToLocalStorage(session, currentStats);
  }
};

// Helper functions for localStorage

const getStatsFromLocalStorage = (): StatsData => {
  const saved = localStorage.getItem('typingStats');
  if (saved) {
    return JSON.parse(saved);
  }
  
  return {
    sessionHistory: [],
    averageWpm: 0,
    averageAccuracy: 0,
    totalPracticeMinutes: 0,
    currentStreak: 0,
    longestStreak: 0
  };
};

const saveSessionToLocalStorage = (session: SessionData, currentStats: StatsData): StatsData => {
  const updatedHistory = [...currentStats.sessionHistory, session];
  
  // Recalculate stats
  const totalWpm = updatedHistory.reduce((sum, s) => sum + s.wpm, 0);
  const totalAccuracy = updatedHistory.reduce((sum, s) => sum + s.accuracy, 0);
  const totalMinutes = updatedHistory.reduce((sum, s) => sum + s.duration, 0);
  
  const updatedStats = {
    sessionHistory: updatedHistory,
    averageWpm: Math.round(totalWpm / updatedHistory.length) || 0,
    averageAccuracy: Math.round(totalAccuracy / updatedHistory.length) || 0,
    totalPracticeMinutes: totalMinutes,
    currentStreak: currentStats.currentStreak, // This would need proper calculation
    longestStreak: currentStats.longestStreak // This would need proper calculation
  };
  
  // Save to localStorage
  localStorage.setItem('typingStats', JSON.stringify(updatedStats));
  
  return updatedStats;
};
