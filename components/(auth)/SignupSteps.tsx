"use client";
import React from "react";

import { signup } from "@/app/action/auth-service";
import { useFunnel } from "@/app/action/funnel";

import Stepper from "./Stepper";
import SignupInfoSection from "./SignupInfoSection";

import { FileTextIcon, CreditCardIcon, UserPenIcon } from "lucide-react";
import PhonenumberSection from "./PhonenumberSection";
import NicknameSection from "./NicknameSection";

export default function SignupSteps() {
  const { Funnel, Step, setStep, formData, setFormData, currentStep } =
    useFunnel("step1");

  const handleNext = (data: any, step: string) => {
    setStep(step);
    setFormData({ ...formData, ...data });
  };
  const handleSubmit = async (data: any) => {
    const signupData = { ...formData, ...data };
    setFormData(signupData);
    const res = await signup(signupData);
    console.log(res);
  };

  return (
    <form>
      <Stepper
        totalSteps={["step1", "step2", "step3"]}
        icons={[
          <FileTextIcon className="w-4 h-4" />,
          <CreditCardIcon className="w-4 h-4" />,
          <UserPenIcon className="w-4 h-4" />,
        ]}
        currentStep={currentStep}
        className="mb-10"
      />
      <Funnel>
        <Step name="step1">
          <SignupInfoSection
            onNext={(data: any) => {
              handleNext(data, "step2");
            }}
          />
        </Step>
        <Step name="step2">
          <PhonenumberSection
            onNext={(data: any) => {
              handleNext(data, "step3");
            }}
          />
        </Step>
        <Step name="step3">
          <NicknameSection
            onNext={(data: any) => {
              handleSubmit(data);
            }}
          />
        </Step>
      </Funnel>
    </form>
  );
}
