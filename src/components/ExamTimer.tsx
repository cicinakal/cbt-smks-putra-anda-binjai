'use client';

import { useEffect, useState } from 'react';

interface ExamTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
}

export default function ExamTimer({ durationMinutes, onTimeUp }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp]);

  useEffect(() => {
    setIsWarning(timeLeft <= 300); // Warning when 5 minutes left
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className={`p-4 rounded-lg font-bold text-center ${
        isWarning ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
      }`}
    >
      <div className="text-sm mb-2">Waktu Tersisa</div>
      <div className="text-3xl font-mono">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
}
