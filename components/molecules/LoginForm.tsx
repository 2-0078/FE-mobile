'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/floating-input';
import PasswordInput from '@/components/atoms/PasswordInput';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string;
  onClearError?: () => void;
}

export default function LoginForm({
  onSubmit,
  error,
  onClearError,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
    if (error && onClearError) {
      onClearError();
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError('');
    }
    if (error && onClearError) {
      onClearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 개별 필드 검증
    let hasError = false;

    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요.');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) {
      return;
    }

    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-0">
      <FloatingInput
        id="email"
        name="email"
        label="Email Address"
        type="email"
        value={email}
        onChange={handleEmailChange}
        required
        error={!!emailError || !!error}
        helperText={emailError || error}
      />

      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value={password}
        onChange={handlePasswordChange}
        required
        error={!!passwordError || !!error}
        helperText={passwordError}
      />

      {/* Login Button */}
      <div className="absolute bottom-24 left-0 right-0 px-4 py-4">
        <Button
          type="submit"
          className="w-full bg-custom-green font-bold text-lg py-4 rounded-md h-14 text-black"
        >
          로그인
        </Button>
      </div>
    </form>
  );
}
