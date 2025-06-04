"use client";
import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFunnel } from "@/app/action/funnel";
import SignupInfoSection from "./SignupInfoSection";
import { signup } from "@/app/action/auth-service/signup";
import Stepper from "./Stepper";
import { FileTextIcon, CreditCardIcon, UserPenIcon } from "lucide-react";
import { test } from "@/app/action/auth-service";
export default function SignupSteps() {
  const { Funnel, Step, setStep, formData, setFormData, currentStep } =
    useFunnel("step1");

  const handleNext = (data: any, step: string) => {
    setStep(step);
    setFormData({ ...formData, ...data });
  };
  const handleSubmit = async (data: any) => {
    const signupData = { ...formData, data };
    setFormData(signupData);
    signup(signupData);
  };
  const handleTest = async () => {
    const response = await test();
    console.log(response);
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
        className="mb-20"
      />
      <Funnel>
        <Step name="step1">
          <SignupInfoSection
            onNext={(data: any, step: string) => {
              handleNext(data, step);
            }}
          />
        </Step>
        <Step name="step2">
          <div>
            <Label>Password</Label>
            <Input type="password" name="password" id="password" />
            <button
              onClick={() => console.log(formData)}
              type="button"
              className="bg-custom-green text-black font-bold text-lg py-4 rounded-full h-14"
            >
              Back
            </button>
            <button
              onClick={() => handleSubmit("asdasd")}
              type="button"
              className="bg-custom-green text-black font-bold text-lg py-4 rounded-full h-14"
            >
              Submit
            </button>
            <button
              onClick={() => handleTest()}
              type="button"
              className="bg-custom-green text-black font-bold text-lg py-4 rounded-full h-14"
            >
              Test
            </button>
          </div>
        </Step>
      </Funnel>
    </form>
  );
}
