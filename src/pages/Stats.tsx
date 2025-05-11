
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  Legend 
} from 'recharts';
import { TrendingUp, Clock, Activity, Star, Check } from "lucide-react";
import { useStatsContext } from "@/context/StatsContext";

const StatContent = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { 
    averageWpm, 
    averageAccuracy, 
    totalPracticeMinutes, 
    currentStreak, 
    longestStreak, 
    sessionHistory 
  } = useStatsContext();

  // Chart data from stats
  const wpmData = sessionHistory.map((session, index) => ({
    name: `Session ${index + 1}`,
    wpm: session.wpm,
  }));

  const accuracyData = sessionHistory.map((session, index) => ({
    name: `Session ${index + 1}`,
    accuracy: session.accuracy,
  }));

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
          
          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>WPM Progress</CardTitle>
                <CardDescription>Your typing speed over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={wpmData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="wpm"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Accuracy</CardTitle>
                <CardDescription>Your typing accuracy over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={accuracyData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#82ca9d"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your last 5 typing practice sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>WPM</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Mode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessionHistory.slice(-5).reverse().map((session, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(session.date).toLocaleString()}</TableCell>
                      <TableCell>{session.duration} mins</TableCell>
                      <TableCell>{session.wpm}</TableCell>
                      <TableCell>{session.accuracy}%</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {session.mode}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
