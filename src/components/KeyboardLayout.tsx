
import React from "react";
import { cn } from "@/lib/utils";

interface KeyboardLayoutProps {
  activeKeys: string[];
  problemKeys: string[];
}

const KeyboardLayout = ({ activeKeys, problemKeys }: KeyboardLayoutProps) => {
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  return (
    <div className="font-mono text-sm p-4 bg-background rounded-md border max-w-4xl mx-auto mt-4">
      <div className="flex flex-col items-center space-y-2">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex space-x-1">
            {row.map((key) => (
              <div
                key={key}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-md border transition-colors",
                  activeKeys.includes(key) && "bg-accent text-accent-foreground",
                  problemKeys.includes(key) && "border-error text-error"
                )}
              >
                {key}
              </div>
            ))}
          </div>
        ))}
        <div className="mt-2 w-64 h-10 flex items-center justify-center rounded-md border">
          space
        </div>
      </div>
    </div>
  );
};

export default KeyboardLayout;
