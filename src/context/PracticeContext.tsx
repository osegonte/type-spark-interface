
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PracticeContextType {
  practiceText: string;
  setPracticeText: (text: string) => void;
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

export function PracticeProvider({ children }: { children: ReactNode }) {
  // Try to get practice text from localStorage if available
  const [practiceText, setPracticeText] = useState<string>(() => {
    const savedText = localStorage.getItem('practiceText');
    return savedText || 'The quick brown fox jumps over the lazy dog. Simple words help build rhythm and get fingers moving.';
  });
  
  return (
    <PracticeContext.Provider value={{ practiceText, setPracticeText }}>
      {children}
    </PracticeContext.Provider>
  );
}

export function usePractice() {
  const context = useContext(PracticeContext);
  if (context === undefined) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
}
