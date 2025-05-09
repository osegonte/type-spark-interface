
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TypingTestProps {
  text: string;
  onComplete: (stats: { wpm: number; accuracy: number; errors: string[] }) => void;
  mode: "warm-up" | "drill" | "challenge" | "error-focus" | "review" | "spaced";
}

const TypingTest = ({ text, onComplete, mode }: TypingTestProps) => {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (startTime === null) {
      setStartTime(Date.now());
    }

    // Check for errors
    if (value.length > 0 && value[value.length - 1] !== text[value.length - 1]) {
      if (!mistakes.includes(text[value.length - 1])) {
        setMistakes([...mistakes, text[value.length - 1]]);
      }
    }

    setInput(value);
    setCurrentPosition(value.length);

    // Check if completed
    if (value.length === text.length) {
      const endTime = Date.now();
      const minutes = (endTime - startTime!) / 60000;
      const words = text.split(" ").length;
      const wpm = Math.round(words / minutes);
      const correctChars = value.split("").filter((char, i) => char === text[i]).length;
      const accuracy = Math.round((correctChars / text.length) * 100);
      
      setCompleted(true);
      onComplete({ wpm, accuracy, errors: mistakes });
    }
  };

  const getCharClass = (index: number) => {
    if (index < currentPosition) {
      return text[index] === input[index] 
        ? "text-success" 
        : "text-error bg-error/10";
    } else if (index === currentPosition) {
      return "text-accent border-b-2 border-accent animate-pulse";
    }
    return "text-muted-foreground";
  };

  const modeLabel = {
    "warm-up": "Warm-up",
    "drill": "Targeted Drill",
    "challenge": "Adaptive Challenge",
    "error-focus": "Error Focus",
    "review": "Review",
    "spaced": "Spaced Repetition"
  }[mode];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <div className="px-6 py-3 border-b flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">{modeLabel}</span>
        {completed && (
          <button 
            className="text-sm text-accent hover:underline"
            onClick={() => {
              setInput("");
              setCurrentPosition(0);
              setMistakes([]);
              setStartTime(null);
              setCompleted(false);
            }}
          >
            Try Again
          </button>
        )}
      </div>
      <CardContent className="p-6">
        <div 
          className="text-lg mb-8 font-mono leading-relaxed"
          aria-label="Text to type"
        >
          {text.split("").map((char, i) => (
            <span 
              key={i} 
              className={getCharClass(i)}
              aria-hidden="true"
            >
              {char}
            </span>
          ))}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          className="w-full p-4 bg-muted/30 rounded-md border focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="Start typing..."
          disabled={completed}
          aria-label="Type the text above"
        />
      </CardContent>
    </Card>
  );
};

export default TypingTest;
