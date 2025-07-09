'use client';

import { ClockIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';

interface CountdownTimerProps {
  endDateTime: string | Date; // 마감일시 (ISO 문자열 또는 Date 객체)
  onExpired?: () => void; // 마감 시 콜백
  variant?: 'default' | 'compact' | 'card'; // 디자인 변형
  className?: string; // 추가 스타일링
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeLeft(endDateTime: string | Date): TimeLeft {
  try {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      };
    }

    const now = new Date().getTime();
    const endTime = new Date(endDateTime).getTime();

    // 유효하지 않은 날짜인 경우
    if (isNaN(endTime)) {
      throw new Error('Invalid date');
    }

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
  } catch {
    // 날짜 파싱 오류 시 만료된 것으로 처리
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }
}

export function CountdownTimer({
  endDateTime,
  onExpired,
  variant = 'default',
  className = '',
}: CountdownTimerProps) {
  // hydration mismatch를 방지하기 위해 초기값을 null로 설정
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // 클라이언트에서만 실행되도록 설정
    setIsClient(true);

    try {
      // 초기 시간 계산
      const initialTime = calculateTimeLeft(endDateTime);
      setTimeLeft(initialTime);
      setHasError(false);

      // 타이머 시작
      const timer = setInterval(() => {
        try {
          const newTimeLeft = calculateTimeLeft(endDateTime);
          setTimeLeft(newTimeLeft);
          setHasError(false);

          // 마감 시간이 지났을 때 콜백 실행
          if (newTimeLeft.isExpired && onExpired) {
            onExpired();
          }
        } catch {
          setHasError(true);
          setTimeLeft({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isExpired: true,
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    } catch {
      setHasError(true);
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      });
    }
  }, [endDateTime, onExpired]);

  // 클라이언트에서 마운트되기 전에는 로딩 상태 표시
  if (!isClient || !timeLeft) {
    return (
      <div
        className={`bg-custom-green text-black px-3 py-1 flex items-center justify-center w-fit min-w-[110px] rounded-sm relative z-[1000] ${className}`}
      >
        <span className="text-white text-xs">loading...</span>
      </div>
    );
  }

  // 에러가 있거나 마감된 경우
  if (hasError || timeLeft.isExpired) {
    if (variant === 'compact') {
      return (
        <div
          className={`bg-custom-red/10 border border-custom-red rounded-sm px-2 py-1 flex items-center justify-center w-fit ${className}`}
        >
          <span className="text-custom-red text-xs font-medium">마감</span>
        </div>
      );
    }

    if (variant === 'card') {
      return (
        <div
          className={`bg-custom-red/10 border border-custom-red rounded-full px-4 py-2 flex items-center justify-center ${className}`}
        >
          <span className="text-custom-red text-sm font-bold">경매 마감</span>
        </div>
      );
    }

    return (
      <div
        className={`border border-custom-light-red rounded-full px-6 py-4 flex items-center justify-center h-10 ${className}`}
      >
        <span className="text-custom-red   font-bold">경매 마감</span>
      </div>
    );
  }

  // 시간이 1일 이하인 경우 긴급 표시
  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 24;
  const isVeryUrgent = timeLeft.days === 0 && timeLeft.hours < 6;
  const isOneDayOrLess = timeLeft.days === 0;

  if (variant === 'compact') {
    const bgColor = isOneDayOrLess ? 'bg-custom-red/90' : 'bg-custom-black/80';
    return (
      <Badge
        className={`${bgColor} text-black px-3 py-1 flex items-center justify-center w-fit min-w-[110px] rounded-sm ${className}`}
      >
        <ClockIcon className="w-3 h-3" />
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {timeLeft.hours > 0 && `${timeLeft.hours}h `}
        {timeLeft.minutes}m {String(timeLeft.seconds).padStart(2, '0')}s
      </Badge>
    );
  }

  if (variant === 'card') {
    const bgColor = isVeryUrgent
      ? 'bg-custom-red/90'
      : isUrgent
        ? 'bg-custom-orange/90'
        : isOneDayOrLess
          ? 'bg-custom-red/80'
          : 'bg-custom-green';

    return (
      <Badge
        className={`${bgColor} text-black px-3 py-[3px] flex items-center justify-center w-fit min-w-[110px] rounded-sm ${className}`}
      >
        <ClockIcon className="w-4 h-4 text-black" />
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {timeLeft.hours > 0 && `${timeLeft.hours}h `}
        {timeLeft.minutes}m {String(timeLeft.seconds).padStart(2, '0')}s
      </Badge>
    );
  }

  // 기본 variant
  const bgColor = isOneDayOrLess ? 'bg-custom-red/90' : 'bg-custom-green/80';
  return (
    <Badge
      className={`${bgColor} text-black px-3 py-[3px] flex items-center justify-center w-fit min-w-[110px] rounded-sm ${className}`}
    >
      <ClockIcon className="w-4 h-4 text-black" />
      {timeLeft.days > 0 && `${timeLeft.days}d `}
      {timeLeft.hours > 0 && `${timeLeft.hours}h `}
      {timeLeft.minutes}m {String(timeLeft.seconds).padStart(2, '0')}s
    </Badge>
  );
}
