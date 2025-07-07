'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { FloatingInput } from '../ui/floating-input';
import { checkNicknameAvailability } from '@/action/validation-service';

export default function NicknameSection({
  onNext,
}: {
  onNext: (data: { nickname: string }) => void;
}) {
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setIsAvailable(null);

    if (nicknameError) {
      setNicknameError('');
    }
  };

  // 닉네임 중복 체크 (디바운스)
  useEffect(() => {
    const checkAvailability = async () => {
      if (!nickname.trim() || nickname.length < 2) {
        setIsAvailable(null);
        return;
      }

      setIsChecking(true);
      try {
        const result = await checkNicknameAvailability(nickname);
        if (result) {
          setIsAvailable(result.result.available);
          if (!result.result.available) {
            setNicknameError('이미 사용 중인 닉네임입니다.');
          } else {
            setNicknameError('');
          }
        } else {
          setIsAvailable(null);
          setNicknameError('닉네임 확인 중 오류가 발생했습니다.');
        }
      } catch (error) {
        setIsAvailable(null);
        setNicknameError('닉네임 확인 중 오류가 발생했습니다.');
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(checkAvailability, 500); // 500ms 디바운스
    return () => clearTimeout(timeoutId);
  }, [nickname]);

  const handleNext = () => {
    if (!nickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }

    if (isAvailable === false) {
      setNicknameError('이미 사용 중인 닉네임입니다.');
      return;
    }

    if (isChecking) {
      setNicknameError('닉네임 확인 중입니다.');
      return;
    }

    setNicknameError('');
    onNext({ nickname });
  };

  return (
    <div className="max-w-md mx-auto px-0">
      <div className="space-y-6">
        <div className="relative">
          <FloatingInput
            id="nickname"
            name="nickname"
            label="닉네임"
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="닉네임을 입력해주세요"
            required
            error={!!nicknameError}
            helperText={nicknameError}
          />
          {isChecking && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-custom-green"></div>
            </div>
          )}
          {isAvailable === true && !isChecking && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="text-custom-green text-sm">✓</div>
            </div>
          )}
          {isAvailable === false && !isChecking && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="text-red-500 text-sm">✗</div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-5 left-0 right-0 px-4 py-4">
        <Button
          type="button"
          className="w-full bg-custom-green text-black font-bold text-lg py-4 rounded-md h-14"
          onClick={handleNext}
          disabled={!nickname.trim() || isAvailable === false || isChecking}
        >
          회원가입
        </Button>
      </div>
    </div>
  );
}
