
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetTime: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!targetTime) return;

    const calculateTime = () => {
      const now = new Date();
      const [hours, minutes] = targetTime.split(':').map(Number);
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);

      // If target time is earlier than now, assume it's for tomorrow? 
      // Actually for "Daily Slate", it's usually today.
      // If it passed, show 00:00:00 or "Overdue"
      
      const diff = target.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('Overdue');
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  if (!targetTime) return null;

  return (
    <div className={`flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-tight px-2 py-0.5 rounded-full border ${timeLeft === 'Overdue' ? 'bg-red-500/10 border-red-500/40 text-red-400' : 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400'}`}>
      <Clock size={10} />
      {timeLeft}
    </div>
  );
};

export default CountdownTimer;
