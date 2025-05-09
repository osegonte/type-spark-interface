
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatsProps {
  wpm: number;
  accuracy: number;
  errors: string[];
  sessionProgress: number;
  sessionType: string;
}

const Stats = ({ wpm, accuracy, errors, sessionProgress, sessionType }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Speed</span>
                <span className="text-sm font-medium">{wpm} WPM</span>
              </div>
              <Progress value={Math.min(wpm / 2, 100)} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Accuracy</span>
                <span className="text-sm font-medium">{accuracy}%</span>
              </div>
              <Progress value={accuracy} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Current Phase</span>
                <span className="text-sm font-medium">{sessionType}</span>
              </div>
              <Progress value={sessionProgress} className="h-2" />
            </div>
            
            {errors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Problem Characters</h4>
                <div className="flex flex-wrap gap-2">
                  {errors.slice(0, 5).map((char, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-error/10 text-error font-mono"
                    >
                      {char === " " ? "⎵" : char}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
