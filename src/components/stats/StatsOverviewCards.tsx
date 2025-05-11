
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, Activity, Check } from "lucide-react";

interface StatsOverviewCardsProps {
  averageWpm: number;
  averageAccuracy: number;
  totalPracticeMinutes: number;
  currentStreak: number;
}

const StatsOverviewCards = ({
  averageWpm,
  averageAccuracy,
  totalPracticeMinutes,
  currentStreak,
}: StatsOverviewCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average WPM</p>
              <h3 className="text-2xl font-bold">{averageWpm}</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
              <h3 className="text-2xl font-bold">{averageAccuracy}%</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Check className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Practice Time</p>
              <h3 className="text-2xl font-bold">{totalPracticeMinutes} mins</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Clock className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
              <h3 className="text-2xl font-bold">{currentStreak} days</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Activity className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverviewCards;
