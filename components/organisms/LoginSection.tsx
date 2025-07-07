'use client';

import { useState, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import LoginForm from '@/components/molecules/LoginForm';
import { AlertContext } from '@/lib/Alert';

interface LoginSectionProps {
  searchParams: Promise<{ callbackUrl: string }>;
}

export default function LoginSection({ searchParams }: LoginSectionProps) {
  const [error, setError] = useState('');
  const router = useRouter();
  const alertContext = useContext(AlertContext);

  // 페이지 로드 시 Alert 초기화 (한 번만 실행)
  useEffect(() => {
    if (alertContext) {
      alertContext.hideAll();
    }
  }, []); // 빈 의존성 배열로 한 번만 실행

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        const errorMessage =
          res.error === 'CredentialsSignin'
            ? '아이디 또는 비밀번호가 일치하지 않습니다.'
            : res.error;
        setError(errorMessage);
        alertContext?.error(errorMessage);
        return;
      }

      if (res?.ok) {
        // NextAuth가 자동으로 리다이렉트를 처리하도록 함
        // callbackUrl이 있으면 해당 URL로, 없으면 홈으로
        try {
          const resolvedSearchParams = await searchParams;
          const callbackUrl = resolvedSearchParams?.callbackUrl;
          await signIn('credentials', {
            email,
            password,
            redirect: true,
            callbackUrl: callbackUrl || '/',
          });
        } catch {
          // searchParams 처리 실패 시 홈으로 리다이렉트
          await signIn('credentials', {
            email,
            password,
            redirect: true,
            callbackUrl: '/',
          });
        }
      }
    } catch {
      const errorMessage = '로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
      alertContext?.error(errorMessage);
    }
  };

  return (
    <>
      <LoginForm
        onSubmit={handleLogin}
        error={error}
        onClearError={() => setError('')}
      />

      {/* SIGNUP Button */}
      <div className="absolute bottom-4 left-0 right-0 py-6 px-4">
        <Button
          onClick={() => router.push('/signup')}
          className="w-full bg-background text-custom-green font-bold text-md py-4 rounded-sm h-14"
        >
          회원가입
        </Button>
      </div>
    </>
  );
}
