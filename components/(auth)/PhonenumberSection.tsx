'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { FloatingInput } from '../ui/floating-input';
import { SelectBox } from '@/lib/SelectBox';
import { validatePhoneNumber, formatPhoneNumber } from '@/lib/validation';
import { sendVerificationCode, verifyCode } from '@/action/auth-service/index';

interface GenderOption {
  value: string;
  label: string;
}

export default function PhonenumberSection({
  onNext,
}: {
  onNext: (data: {
    phoneNumber: string;
    name: string;
    birthdate: string;
    gender: string;
  }) => void;
}) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3분 = 180초

  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // 개별 에러 상태
  const [nameError, setNameError] = useState('');
  const [birthdateError, setBirthdateError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // 타이머 효과
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isVerificationSent && timeLeft > 0 && !isVerified) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsVerificationSent(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVerificationSent, timeLeft, isVerified]);

  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case 'name':
        setName(value);
        if (nameError) setNameError('');
        break;
      case 'birthdate':
        setBirthdate(value);
        if (birthdateError) setBirthdateError('');
        break;
      case 'phoneNumber':
        const formattedPhone = formatPhoneNumber(value);
        setPhoneNumber(formattedPhone);
        if (phoneNumberError) setPhoneNumberError('');
        break;
      case 'verificationCode':
        setVerificationCode(value);
        if (verificationCodeError) setVerificationCodeError('');
        break;
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleGenderSelect = (item: GenderOption) => {
    setGender(item.value);
    if (genderError) setGenderError('');
  };

  const handleSendVerification = async () => {
    let hasError = false;

    if (!name.trim()) {
      setNameError('이름을 입력해주세요.');
      hasError = true;
    } else {
      setNameError('');
    }

    if (!birthdate.trim()) {
      setBirthdateError('생년월일을 입력해주세요.');
      hasError = true;
    } else {
      setBirthdateError('');
    }

    if (!gender.trim()) {
      setGenderError('성별을 선택해주세요.');
      hasError = true;
    } else {
      setGenderError('');
    }

    if (!phoneNumber.trim()) {
      setPhoneNumberError('휴대전화 번호를 입력해주세요.');
      hasError = true;
    } else if (!validatePhoneNumber(phoneNumber)) {
      setPhoneNumberError('010xxxxxxxx 형식의 휴대전화 번호를 입력해주세요.');
      hasError = true;
    } else {
      setPhoneNumberError('');
    }

    if (hasError) {
      return;
    }

    setIsSendingCode(true);
    setGeneralError('');

    try {
      const result = await sendVerificationCode(phoneNumber);

      if (result && result.isSuccess) {
        setIsVerificationSent(true);
        setTimeLeft(180); // 3분으로 리셋
        setGeneralError('');
      } else {
        setGeneralError('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch {
      setGeneralError('인증번호 발송 중 오류가 발생했습니다.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResendVerification = async () => {
    setIsSendingCode(true);
    setGeneralError('');

    try {
      const result = await sendVerificationCode(phoneNumber);

      if (result && result.isSuccess) {
        setTimeLeft(180); // 3분으로 리셋
        setVerificationCode('');
        setVerificationCodeError('');
        setGeneralError('');
      } else {
        setGeneralError('인증번호 재발송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch {
      setGeneralError('인증번호 재발송 중 오류가 발생했습니다.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setVerificationCodeError('인증번호를 입력해주세요.');
      return;
    }
    if (timeLeft === 0) {
      setVerificationCodeError('인증번호가 만료되었습니다. 다시 발송해주세요.');
      return;
    }

    setIsVerifyingCode(true);
    setVerificationCodeError('');

    try {
      const result = await verifyCode(phoneNumber, verificationCode);

      if (result && result.isSuccess) {
        setIsVerified(true);
        setVerificationCodeError('');
        setGeneralError('');
      } else {
        setVerificationCodeError(
          '인증번호가 올바르지 않습니다. 다시 확인해주세요.'
        );
      }
    } catch {
      setVerificationCodeError('인증번호 확인 중 오류가 발생했습니다.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleNext = () => {
    if (!isVerified) {
      setGeneralError('휴대폰 인증을 완료해주세요.');
      return;
    }
    setGeneralError('');
    onNext({ phoneNumber, name, birthdate, gender });
  };

  const genderOptions: GenderOption[] = [
    { value: '남성', label: '남성' },
    { value: '여성', label: '여성' },
  ];

  return (
    <div className="max-w-md mx-auto px-0">
      <div className="space-y-6">
        <FloatingInput
          id="name"
          name="name"
          label="이름"
          type="text"
          value={name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          required
          error={!!nameError}
          helperText={nameError}
        />

        <FloatingInput
          id="birthdate"
          name="birthdate"
          label="생년월일"
          type="text"
          value={birthdate}
          onChange={(e) => handleFieldChange('birthdate', e.target.value)}
          placeholder="YYYYMMDD"
          required
          error={!!birthdateError}
          helperText={birthdateError}
        />

        <SelectBox
          id="gender"
          title="성별"
          required
          disabled={false}
          className="w-full"
          name="gender"
          onSelect={handleGenderSelect}
          items={genderOptions}
          valueKey="value"
          labelKey="label"
          defaultValue={genderOptions.find((item) => item.value === gender)}
          selectWidth="100%"
          errorMessage={genderError}
        />

        <div className="space-y-4">
          <FloatingInput
            id="phonenumber"
            name="phonenumber"
            label="휴대전화 번호"
            type="tel"
            value={phoneNumber}
            onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
            placeholder="010xxxxxxxx"
            required
            error={!!phoneNumberError}
            helperText={phoneNumberError}
          />
          {!isVerificationSent && (
            <Button
              onClick={handleSendVerification}
              type="button"
              disabled={
                !name.trim() ||
                !birthdate.trim() ||
                !gender.trim() ||
                !phoneNumber.trim() ||
                isSendingCode
              }
              className="w-full bg-custom-green text-black font-bold px-4 rounded-md h-14 disabled:opacity-50"
            >
              {isSendingCode ? '발송 중...' : '인증하기'}
            </Button>
          )}
        </div>

        {isVerificationSent && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <FloatingInput
                  id="verificationCode"
                  name="verificationCode"
                  label="인증번호"
                  type="text"
                  value={verificationCode}
                  onChange={(e) =>
                    handleFieldChange('verificationCode', e.target.value)
                  }
                  placeholder="인증번호 6자리"
                  required
                  error={!!verificationCodeError}
                  helperText={verificationCodeError}
                  disabled={isVerified}
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none peer-focus:text-custom-green transition-colors">
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {timeLeft > 0 ? formatTime(timeLeft) : '만료됨'}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={timeLeft === 0 || isVerified || isVerifyingCode}
                  className="w-20 bg-custom-green text-black font-bold px-2 py-2 rounded-md h-14 disabled:opacity-50 text-sm"
                >
                  {isVerifyingCode ? '확인 중...' : '확인'}
                </Button>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isVerified || isSendingCode}
                className="text-sm text-custom-green underline hover:no-underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingCode ? '재발송 중...' : '인증번호 재발송'}
              </button>
            </div>
          </div>
        )}

        {generalError && (
          <p className="text-red-500 text-sm text-center">{generalError}</p>
        )}
      </div>

      {isVerified && (
        <div className="fixed bottom-5 left-0 right-0 px-4 py-4">
          <Button
            type="button"
            className="w-full bg-custom-green text-black font-bold text-lg py-4 rounded-md h-14"
            onClick={handleNext}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
