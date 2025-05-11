
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface SessionData {
  date: string;
  duration: number;
  wpm: number;
  accuracy: number;
  mode: string;
}

interface SessionHistoryTableProps {
  sessionHistory: SessionData[];
}

const SessionHistoryTable = ({ sessionHistory }: SessionHistoryTableProps) => {
  return (
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
  );
};

export default SessionHistoryTable;
