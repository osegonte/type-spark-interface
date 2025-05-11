
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useStatsContext } from "@/context/StatsContext";

// Import our new components
import StatsOverviewCards from "@/components/stats/StatsOverviewCards";
import PerformanceCharts from "@/components/stats/PerformanceCharts";
import SessionHistoryTable from "@/components/stats/SessionHistoryTable";

const StatContent = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { 
    averageWpm, 
    averageAccuracy, 
    totalPracticeMinutes, 
    currentStreak, 
    sessionHistory,
    isLoading
  } = useStatsContext();

  // If loading, show a simple loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header theme={theme} onThemeChange={setTheme} />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-medium mb-4">Loading your stats...</h2>
            <div className="animate-pulse h-4 w-48 bg-muted rounded mx-auto"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header theme={theme} onThemeChange={setTheme} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-medium mb-2">Performance Statistics</h1>
              <p className="text-muted-foreground mb-6">
                Track your typing progress over time
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
          
          <Separator className="my-6" />
          
          {/* Stats Overview Cards */}
          <StatsOverviewCards
            averageWpm={averageWpm}
            averageAccuracy={averageAccuracy}
            totalPracticeMinutes={totalPracticeMinutes}
            currentStreak={currentStreak}
          />
          
          {/* Performance Charts */}
          <PerformanceCharts sessionHistory={sessionHistory} />
          
          {/* Recent Sessions */}
          <SessionHistoryTable sessionHistory={sessionHistory} />
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4">
          <p className="text-sm text-center text-muted-foreground">
            Designed for maximum comfort and learning efficiency
          </p>
        </div>
      </footer>
    </div>
  );
};

const Stats = () => {
  return (
    <ThemeProvider>
      <StatContent />
    </ThemeProvider>
  );
};

export default Stats;
