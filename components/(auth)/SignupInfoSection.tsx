'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { FloatingInput } from '../ui/floating-input';
import PasswordInput from '../atoms/PasswordInput';
import { checkEmailAvailability } from '@/action/validation-service';
import { validateEmail, validatePassword } from '@/lib/validation';

export default function SignupInfoSection({
  onNext,
}: {
  onNext: (data: { email: string; password: string }) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(
    null
  );
  const [passwordStrength, setPasswordStrength] = useState<{
    isValid: boolean;
    errors: string[];
  }>({ isValid: false, errors: [] });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailAvailable(null);

    if (emailError) {
      setEmailError('');
    }
  };

  // 이메일 중복 체크 (디바운스)
  useEffect(() => {
    const checkAvailability = async () => {
      if (!email.trim() || !validateEmail(email)) {
        setIsEmailAvailable(null);
        return;
      }

      setIsCheckingEmail(true);
      try {
        const result = await checkEmailAvailability(email);
        if (result) {
          setIsEmailAvailable(result.result.available);
          if (!result.result.available) {
            setEmailError('이미 사용 중인 이메일입니다.');
          } else {
            setEmailError('');
          }
        } else {
          setIsEmailAvailable(null);
          setEmailError('이메일 확인 중 오류가 발생했습니다.');
        }
      } catch {
        setIsEmailAvailable(null);
        setEmailError('이메일 확인 중 오류가 발생했습니다.');
      } finally {
        setIsCheckingEmail(false);
      }
    };

    const timeoutId = setTimeout(checkAvailability, 500); // 500ms 디바운스
    return () => clearTimeout(timeoutId);
  }, [email]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    // 비밀번호 강도 검증
    const validation = validatePassword(value);
    setPasswordStrength(validation);

    if (passwordError) {
      setPasswordError('');
    }
    if (confirmPasswordError) {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (confirmPasswordError) {
      setConfirmPasswordError('');
    }
  };

  const handleNext = () => {
    let hasError = false;

    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요.');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      hasError = true;
    } else if (isEmailAvailable === false) {
      setEmailError('이미 사용 중인 이메일입니다.');
      hasError = true;
    } else if (isCheckingEmail) {
      setEmailError('이메일 확인 중입니다.');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요.');
      hasError = true;
    } else if (!passwordStrength.isValid) {
      setPasswordError(passwordStrength.errors[0]); // 첫 번째 에러 메시지 표시
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('비밀번호 확인을 입력해주세요.');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }

    if (hasError) {
      return;
    }

    onNext({ email, password });
  };

  return (
    <>
      <div className="space-y-6 px-0">
        <div className="relative">
          <FloatingInput
            id="email"
            name="email"
            label="아이디 (이메일)"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            error={!!emailError}
            helperText={emailError}
          />
          {isCheckingEmail && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-custom-green"></div>
            </div>
          )}
          {isEmailAvailable === true && !isCheckingEmail && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="text-custom-green text-sm">✓</div>
            </div>
          )}
          {isEmailAvailable === false && !isCheckingEmail && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="text-red-500 text-sm">✗</div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <PasswordInput
            id="password"
            name="password"
            label="비밀번호"
            value={password}
            onChange={handlePasswordChange}
            required
            error={!!passwordError}
            helperText={passwordError}
          />

          {/* 비밀번호 강도 표시 */}
          {password && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-500">비밀번호 강도:</div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 w-8 rounded ${
                        passwordStrength.isValid
                          ? 'bg-custom-green'
                          : password.length > 0
                            ? 'bg-gray-300'
                            : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  {passwordStrength.isValid ? '강함' : '약함'}
                </div>
              </div>

              {/* 비밀번호 요구사항 체크리스트 */}
              {password && (
                <div className="text-xs space-y-1">
                  <div
                    className={`flex items-center space-x-1 ${
                      password.length >= 10 && password.length <= 20
                        ? 'text-custom-green'
                        : 'text-gray-400'
                    }`}
                  >
                    <span>
                      {password.length >= 10 && password.length <= 20
                        ? '✓'
                        : '○'}
                    </span>
                    <span>10~20자</span>
                  </div>
                  <div
                    className={`flex items-center space-x-1 ${
                      /[a-zA-Z]/.test(password)
                        ? 'text-custom-green'
                        : 'text-gray-400'
                    }`}
                  >
                    <span>{/[a-zA-Z]/.test(password) ? '✓' : '○'}</span>
                    <span>영문자 포함</span>
                  </div>
                  <div
                    className={`flex items-center space-x-1 ${
                      /\d/.test(password)
                        ? 'text-custom-green'
                        : 'text-gray-400'
                    }`}
                  >
                    <span>{/\d/.test(password) ? '✓' : '○'}</span>
                    <span>숫자 포함</span>
                  </div>
                  <div
                    className={`flex items-center space-x-1 ${
                      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
                        ? 'text-custom-green'
                        : 'text-gray-400'
                    }`}
                  >
                    <span>
                      {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
                        ? '✓'
                        : '○'}
                    </span>
                    <span>특수문자 포함</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="비밀번호 확인"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
        />
      </div>

      <div className="fixed bottom-5 left-0 right-0 px-4 py-4">
        <Button
          type="button"
          className="w-full bg-custom-green text-black font-bold text-lg py-4 rounded-md h-14"
          onClick={handleNext}
          disabled={
            isEmailAvailable === false ||
            isCheckingEmail ||
            !passwordStrength.isValid ||
            password !== confirmPassword
          }
        >
          다음
        </Button>
      </div>
    </>
  );
}
