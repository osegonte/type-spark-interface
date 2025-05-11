
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

interface SessionData {
  wpm: number;
  [key: string]: any;
}

interface WpmChartProps {
  sessionHistory: SessionData[];
}

const WpmChart = ({ sessionHistory }: WpmChartProps) => {
  const wpmData = sessionHistory.map((session, index) => ({
    name: `Session ${index + 1}`,
    wpm: session.wpm,
  }));

  return (
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
  );
};

export default WpmChart;
