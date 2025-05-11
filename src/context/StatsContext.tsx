
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStats, saveSession } from '@/utils/dataProvider';

export interface SessionData {
  date: string;
  duration: number;
  wpm: number;
  accuracy: number;
  mode: string;
  errorKeys: string[];
}

interface StatsContextData {
  averageWpm: number;
  averageAccuracy: number;
  totalPracticeMinutes: number;
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  sessionHistory: SessionData[];
  addSession: (session: SessionData) => void;
  isLoading: boolean;
}

const StatsContext = createContext<StatsContextData | undefined>(undefined);

export function StatsProvider({ children }: { children: ReactNode }) {
  const [sessionHistory, setSessionHistory] = useState<SessionData[]>([]);
  const [averageWpm, setAverageWpm] = useState(0);
  const [averageAccuracy, setAverageAccuracy] = useState(0);
  const [totalPracticeMinutes, setTotalPracticeMinutes] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load initial stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const stats = await getStats();
        
        setSessionHistory(stats.sessionHistory);
        setAverageWpm(stats.averageWpm);
        setAverageAccuracy(stats.averageAccuracy);
        setTotalPracticeMinutes(stats.totalPracticeMinutes);
        setCurrentStreak(stats.currentStreak);
        setLongestStreak(stats.longestStreak);
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStats();
  }, []);
  
  const calculateStreaks = () => {
    if (sessionHistory.length === 0) {
      setCurrentStreak(0);
      setLongestStreak(0);
      return;
    }
    
    // Sort sessions by date
    const sortedSessions = [...sessionHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Get array of unique dates (YYYY-MM-DD format)
    const uniqueDates = Array.from(new Set(
      sortedSessions.map(session => session.date.split('T')[0])
    ));
    
    // Check if most recent date is today
    const today = new Date().toISOString().split('T')[0];
    const hasToday = uniqueDates[0] === today;
    
    // Calculate current streak
    let streak = hasToday ? 1 : 0;
    
    if (uniqueDates.length > 1) {
      for (let i = hasToday ? 1 : 0; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i]);
        const previousDate = new Date(uniqueDates[i-1]);
        
        // Check if dates are consecutive
        const diffTime = previousDate.getTime() - currentDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
    
    setCurrentStreak(streak);
    setLongestStreak(prev => Math.max(prev, streak));
  };
  
  const addSession = async (session: SessionData) => {
    try {
      setIsLoading(true);
      
      // Get current stats for the data provider
      const currentStats = {
        sessionHistory,
        averageWpm,
        averageAccuracy,
        totalPracticeMinutes,
        currentStreak,
        longestStreak
      };
      
      // Save session and get updated stats
      const updatedStats = await saveSession(session, currentStats);
      
      // Update state with new values
      setSessionHistory(updatedStats.sessionHistory);
      setAverageWpm(updatedStats.averageWpm);
      setAverageAccuracy(updatedStats.averageAccuracy);
      setTotalPracticeMinutes(updatedStats.totalPracticeMinutes);
      
      // Recalculate streaks
      calculateStreaks();
    } catch (error) {
      console.error("Error adding session:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <StatsContext.Provider value={{ 
      averageWpm,
      averageAccuracy,
      totalPracticeMinutes,
      currentStreak,
      longestStreak,
      totalSessions: sessionHistory.length,
      sessionHistory,
      addSession,
      isLoading
    }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStatsContext() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStatsContext must be used within a StatsProvider');
  }
  return context;
}
