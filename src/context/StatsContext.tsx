
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
}

const StatsContext = createContext<StatsContextData | undefined>(undefined);

export function StatsProvider({ children }: { children: ReactNode }) {
  const [sessionHistory, setSessionHistory] = useState<SessionData[]>(() => {
    const saved = localStorage.getItem('typingStats');
    return saved ? JSON.parse(saved).sessionHistory : [];
  });
  
  const [averageWpm, setAverageWpm] = useState(0);
  const [averageAccuracy, setAverageAccuracy] = useState(0);
  const [totalPracticeMinutes, setTotalPracticeMinutes] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  
  // Calculate stats whenever session history changes
  useEffect(() => {
    if (sessionHistory.length === 0) {
      setAverageWpm(0);
      setAverageAccuracy(0);
      setTotalPracticeMinutes(0);
      return;
    }
    
    // Calculate average WPM
    const totalWpm = sessionHistory.reduce((sum, session) => sum + session.wpm, 0);
    setAverageWpm(Math.round(totalWpm / sessionHistory.length));
    
    // Calculate average accuracy
    const totalAccuracy = sessionHistory.reduce((sum, session) => sum + session.accuracy, 0);
    setAverageAccuracy(Math.round(totalAccuracy / sessionHistory.length));
    
    // Calculate total practice time
    const totalMinutes = sessionHistory.reduce((sum, session) => sum + session.duration, 0);
    setTotalPracticeMinutes(totalMinutes);
    
    // Calculate streaks
    calculateStreaks();
    
    // Save to local storage
    localStorage.setItem('typingStats', JSON.stringify({ 
      sessionHistory,
      averageWpm: Math.round(totalWpm / sessionHistory.length),
      averageAccuracy: Math.round(totalAccuracy / sessionHistory.length),
      totalPracticeMinutes: totalMinutes,
      currentStreak,
      longestStreak
    }));
  }, [sessionHistory]);
  
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
  
  const addSession = (session: SessionData) => {
    setSessionHistory(prev => [...prev, session]);
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
      addSession
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
