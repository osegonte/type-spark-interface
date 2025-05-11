
// API endpoints configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Types
import { SessionData } from '@/context/StatsContext';

// API error handler
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  // You could add more error handling logic here
  throw error;
};

// Fetch all session history for a user
export const fetchSessionHistory = async (userId?: string): Promise<SessionData[]> => {
  try {
    // In a real implementation, you would use the userId parameter
    // For now, we'll make a generic fetch request
    const response = await fetch(`${API_BASE_URL}/sessions`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Add a new session
export const addSessionData = async (session: SessionData, userId?: string): Promise<SessionData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...session, userId }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get user stats (aggregated data)
export const fetchUserStats = async (userId?: string): Promise<{
  averageWpm: number;
  averageAccuracy: number;
  totalPracticeMinutes: number;
  currentStreak: number;
  longestStreak: number;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats${userId ? `?userId=${userId}` : ''}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};
