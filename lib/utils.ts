import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  if (price >= 100000000) {
    return `${(price / 100000000).toFixed(0)}억${
      (price % 100000000) / 10000
    }만원`;
  } else if (price >= 10000) {
    return `${(price / 10000).toFixed(0)}만원`;
  } else {
    return `${price.toLocaleString()}원`;
  }
}

export function getDaysLeft(date: string) {
  // 클라이언트 사이드에서만 실행
  if (typeof window === 'undefined') {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const dateObj = new Date(date);
  const today = new Date();
  let diffTime = dateObj.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  diffTime -= diffDays * 1000 * 60 * 60 * 24;
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  diffTime -= diffHours * 1000 * 60 * 60;
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  diffTime -= diffMinutes * 1000 * 60;
  const diffSeconds = Math.floor(diffTime / 1000);
  return {
    days: diffDays,
    hours: diffHours,
    minutes: diffMinutes,
    seconds: diffSeconds,
  };
}
