import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TypingTest from "./TypingTest";
import Stats from "./Stats";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, BarChart } from "lucide-react";
import { usePractice } from "@/context/PracticeContext";
import { useStatsContext } from "@/context/StatsContext";

type SessionMode = "warm-up" | "drill" | "challenge" | "error-focus" | "review" | "spaced";

interface SessionStep {
  mode: SessionMode;
  text: string;
  durationSeconds: number;
}

const SessionManager = () => {
  const { practiceText } = usePractice();
  const [session, setSession] = useState<SessionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0, errors: [] as string[] });
  const [problemKeys, setProblemKeys] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionInProgress, setSessionInProgress] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const { addSession } = useStatsContext();
  const navigate = useNavigate();

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

  const generateSession = () => {
    // Create chunks from the practice text
    const words = practiceText.split(/\s+/);
    const chunkSize = Math.floor(words.length / 6); // Divide into 6 sections for each session step
    
    const chunks: string[] = [];
    for (let i = 0; i < 6; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, words.length);
      chunks.push(words.slice(start, end).join(' '));
    }
    
    return [
      {
        mode: "warm-up" as SessionMode,
        text: chunks[0] || "The quick brown fox jumps over the lazy dog.",
        durationSeconds: 120 // 2 minutes
      },
      {
        mode: "drill" as SessionMode,
        text: chunks[1] || "Typing practice builds muscle memory through repetition.",
        durationSeconds: 300 // 5 minutes
      },
      {
        mode: "challenge" as SessionMode,
        text: chunks[2] || "Mastering typing requires consistent practice and focused attention.",
        durationSeconds: 300 // 5 minutes
      },
      {
        mode: "error-focus" as SessionMode,
        text: chunks[3] || "The five boxing wizards jump quickly.",
        durationSeconds: 180 // 3 minutes
      },
      {
        mode: "review" as SessionMode,
        text: chunks[4] || "Review your progress and identify areas for improvement.",
        durationSeconds: 180 // 3 minutes
      },
      {
        mode: "spaced" as SessionMode,
        text: chunks[5] || "Recall what you've practiced.",
        durationSeconds: 120 // 2 minutes
      }
    ];
  };

  const startSession = () => {
    const newSession = generateSession();
    setSession(newSession);
    setCurrentStepIndex(0);
    setSessionInProgress(true);
    setIsCompleted(false);
    setSessionStartTime(new Date());
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
      finishSession();
    }
  };

  const finishSession = () => {
    setIsCompleted(true);
    setSessionInProgress(false);

    // Record session stats
    if (sessionStartTime) {
      const sessionEndTime = new Date();
      const durationMinutes = Math.round((sessionEndTime.getTime() - sessionStartTime.getTime()) / 60000);
      
      addSession({
        date: new Date().toISOString(),
        duration: durationMinutes,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        mode: session[currentStepIndex]?.mode || "practice",
        errorKeys: stats.errors
      });
    }
  };

  const sessionProgress = ((currentStepIndex) / (session.length)) * 100;

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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Button 
              onClick={startSession}
              variant="outline"
            >
              Start New Session
            </Button>
            <Button 
              onClick={() => navigate("/stats")}
              className="flex items-center gap-2"
            >
              <BarChart className="h-4 w-4" />
              View Stats
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionManager;
