
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
  accuracy: number;
  [key: string]: any;
}

interface AccuracyChartProps {
  sessionHistory: SessionData[];
}

const AccuracyChart = ({ sessionHistory }: AccuracyChartProps) => {
  const accuracyData = sessionHistory.map((session, index) => ({
    name: `Session ${index + 1}`,
    accuracy: session.accuracy,
  }));

  return (
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
  );
};

export default AccuracyChart;
