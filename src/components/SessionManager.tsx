
import React, { useState, useEffect } from "react";
import TypingTest from "./TypingTest";
import Stats from "./Stats";
import KeyboardLayout from "./KeyboardLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock } from "lucide-react";

type SessionMode = "warm-up" | "drill" | "challenge" | "error-focus" | "review" | "spaced";

interface SessionStep {
  mode: SessionMode;
  text: string;
  durationSeconds: number;
}

const generateSession = (): SessionStep[] => {
  // In a real app, these would be generated based on user history, level, etc.
  return [
    {
      mode: "warm-up",
      text: "The quick brown fox jumps over the lazy dog. Simple words help build rhythm and get fingers moving.",
      durationSeconds: 120 // 2 minutes
    },
    {
      mode: "drill",
      text: "Typing practice builds muscle memory through repetition. Focus on these letter combinations: th, ing, and, ion, ent.",
      durationSeconds: 300 // 5 minutes
    },
    {
      mode: "challenge",
      text: "Mastering typing requires consistent practice and focused attention on both speed and accuracy rather than just one aspect alone.",
      durationSeconds: 300 // 5 minutes
    },
    {
      mode: "error-focus",
      text: "The five boxing wizards jump quickly. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!",
      durationSeconds: 180 // 3 minutes
    },
    {
      mode: "review",
      text: "Review your progress and identify areas for improvement. Slower typing with perfect form builds better habits than rushed errors.",
      durationSeconds: 180 // 3 minutes
    },
    {
      mode: "spaced",
      text: "Recall what you've practiced. The quick brown fox jumps over the lazy dog while five boxing wizards watch quickly.",
      durationSeconds: 120 // 2 minutes
    }
  ];
};

const SessionManager = () => {
  const [session, setSession] = useState<SessionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0, errors: [] as string[] });
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [problemKeys, setProblemKeys] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionInProgress, setSessionInProgress] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    if (sessionInProgress && secondsRemaining > 0) {
      const timer = setTimeout(() => {
        setSecondsRemaining(secondsRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (sessionInProgress && secondsRemaining === 0 && !isCompleted) {
      moveToNextStep();
    }
  }, [sessionInProgress, secondsRemaining, isCompleted]);

  const startSession = () => {
    const newSession = generateSession();
    setSession(newSession);
    setCurrentStepIndex(0);
    setSessionInProgress(true);
    setIsCompleted(false);
    setSecondaryTimer(newSession[0].durationSeconds);
  };

  const setSecondaryTimer = (seconds: number) => {
    setSecondsRemaining(seconds);
  };

  const handleComplete = (stepStats: { wpm: number; accuracy: number; errors: string[] }) => {
    setStats(stepStats);
    setProblemKeys(stepStats.errors.slice(0, 5));
    
    // Auto-advance after a short delay
    setTimeout(() => {
      moveToNextStep();
    }, 2000);
  };

  const moveToNextStep = () => {
    if (currentStepIndex < session.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setSecondaryTimer(session[nextIndex].durationSeconds);
    } else {
      setIsCompleted(true);
      setSessionInProgress(false);
    }
  };

  // Calculate overall session progress
  const sessionProgress = ((currentStepIndex) / (session.length)) * 100;

  // Format seconds as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      {!sessionInProgress && !isCompleted && (
        <div className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-medium">Ready to improve your typing?</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            This 20-minute session includes warm-up, targeted practice, and review phases to build your typing speed and accuracy.
          </p>
          <Button 
            onClick={startSession}
            size="lg"
            className="mt-4"
          >
            Start 20-Minute Session
          </Button>
        </div>
      )}

      {sessionInProgress && session.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-muted-foreground">
              Phase {currentStepIndex + 1} of {session.length}
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatTime(secondsRemaining)} remaining</span>
            </div>
          </div>

          <TypingTest 
            text={session[currentStepIndex].text}
            onComplete={handleComplete}
            mode={session[currentStepIndex].mode}
          />

          <KeyboardLayout 
            activeKeys={activeKeys} 
            problemKeys={problemKeys} 
          />

          <Stats 
            wpm={stats.wpm} 
            accuracy={stats.accuracy} 
            errors={stats.errors}
            sessionProgress={sessionProgress}
            sessionType={session[currentStepIndex].mode}
          />
        </>
      )}

      {isCompleted && (
        <div className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-medium">Session Complete!</h2>
          <p className="text-muted-foreground">
            Great job! You've completed your typing practice session.
          </p>
          <div className="py-4">
            <Stats 
              wpm={stats.wpm} 
              accuracy={stats.accuracy} 
              errors={stats.errors}
              sessionProgress={100}
              sessionType="Completed"
            />
          </div>
          <Button 
            onClick={startSession}
            variant="outline"
            className="mt-4"
          >
            Start New Session
          </Button>
        </div>
      )}
    </div>
  );
};

export default SessionManager;
