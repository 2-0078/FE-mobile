'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/action/auth-service/index';
import { useFunnel } from '@/action/funnel';
import { useAlert } from '@/hooks/useAlert';

import Stepper from './Stepper';
import SignupInfoSection from './SignupInfoSection';

import { FileTextIcon, CreditCardIcon, UserPenIcon } from 'lucide-react';
import PhonenumberSection from './PhonenumberSection';
import NicknameSection from './NicknameSection';

export default function SignupSteps() {
  const router = useRouter();
  const { Funnel, Step, setStep, formData, setFormData, currentStep } =
    useFunnel('step1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error: showError } = useAlert();

  const handleNext = (data: Record<string, string>, step: string) => {
    setStep(step);
    setFormData({ ...formData, ...data });
  };

  const handleSubmit = async (data: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      const signupData = { ...formData, ...data };
      setFormData(signupData);
      const res = await signup(signupData);

      if (res.isSuccess) {
        success('🎉 회원가입이 완료되었습니다!');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        const errorMessage = res.message || '회원가입에 실패했습니다.';
        showError(errorMessage);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      showError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6 px-0 pt-20">
      <Stepper
        totalSteps={['step1', 'step2', 'step3']}
        icons={[
          <FileTextIcon className="w-4 h-4" key="step1" />,
          <CreditCardIcon className="w-4 h-4" key="step2" />,
          <UserPenIcon className="w-4 h-4" key="step3" />,
        ]}
        currentStep={currentStep}
        className="mb-10"
      />
      <Funnel>
        <Step name="step1">
          <SignupInfoSection
            onNext={(data: { email: string; password: string }) => {
              handleNext(data, 'step2');
            }}
          />
        </Step>
        <Step name="step2">
          <PhonenumberSection
            onNext={(data: {
              phoneNumber: string;
              name: string;
              birthdate: string;
              gender: string;
            }) => {
              handleNext(data, 'step3');
            }}
          />
        </Step>
        <Step name="step3">
          <NicknameSection
            onNext={(data: { nickname: string }) => {
              handleSubmit(data);
            }}
            isSubmitting={isSubmitting}
          />
        </Step>
      </Funnel>
    </form>
  );
}
