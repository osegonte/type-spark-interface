
import React from "react";
import WpmChart from "./WpmChart";
import AccuracyChart from "./AccuracyChart";

interface SessionData {
  wpm: number;
  accuracy: number;
  [key: string]: any;
}

interface PerformanceChartsProps {
  sessionHistory: SessionData[];
}

const PerformanceCharts = ({ sessionHistory }: PerformanceChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <WpmChart sessionHistory={sessionHistory} />
      <AccuracyChart sessionHistory={sessionHistory} />
    </div>
  );
};

export default PerformanceCharts;
