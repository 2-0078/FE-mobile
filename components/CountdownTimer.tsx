'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDateTime: string | Date; // 마감일시 (ISO 문자열 또는 Date 객체)
  onExpired?: () => void; // 마감 시 콜백
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeLeft(endDateTime: string | Date): TimeLeft {
  const now = new Date().getTime();
  const endTime = new Date(endDateTime).getTime();
  const difference = endTime - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
}

export function CountdownTimer({
  endDateTime,
  onExpired,
}: CountdownTimerProps) {
  // hydration mismatch를 방지하기 위해 초기값을 null로 설정
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 클라이언트에서만 실행되도록 설정
    setIsClient(true);

    // 초기 시간 계산
    const initialTime = calculateTimeLeft(endDateTime);
    setTimeLeft(initialTime);

    // 타이머 시작
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(endDateTime);
      setTimeLeft(newTimeLeft);

      // 마감 시간이 지났을 때 콜백 실행
      if (newTimeLeft.isExpired && onExpired) {
        onExpired();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDateTime, onExpired]);

  // 클라이언트에서 마운트되기 전에는 로딩 상태 표시
  if (!isClient || !timeLeft) {
    return (
      <div className="border border-custom-gray-100 rounded-full px-6 py-4 flex items-center justify-between h-10">
        <span className="text-white text-base">마감까지</span>
        <div className="text-custom-green text-base font-bold">
          --d : --h : --m : --s
        </div>
      </div>
    );
  }

  // 마감된 경우 다른 스타일로 표시
  if (timeLeft.isExpired) {
    return (
      <div className="border border-custom-light-red rounded-full px-6 py-4 flex items-center justify-center h-10">
        <span className="text-custom-red text-lg font-bold">경매 마감</span>
      </div>
    );
  }

  return (
    <div className="border border-custom-gray-100 rounded-full px-6 py-4 flex items-center justify-between h-10">
      <span className="text-base">마감까지</span>
      <div className="text-custom-green text-base font-bold">
        {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m :{' '}
        {String(timeLeft.seconds).padStart(2, '0')}s
      </div>
    </div>
  );
}
