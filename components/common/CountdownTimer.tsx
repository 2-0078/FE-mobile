'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  deadline: Date;
}

export default function CountdownTimer({ deadline }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = deadline.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div className="text-center">
      <p className="text-xs">마감까지</p>
      <div className="flex gap-1 text-sm font-bold">
        {timeLeft.days > 0 && (
          <>
            <span>{formatTime(timeLeft.days)}</span>
            <span>일</span>
          </>
        )}
        <span>{formatTime(timeLeft.hours)}</span>
        <span>:</span>
        <span>{formatTime(timeLeft.minutes)}</span>
        <span>:</span>
        <span>{formatTime(timeLeft.seconds)}</span>
      </div>
    </div>
  );
} 