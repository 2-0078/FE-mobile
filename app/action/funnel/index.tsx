"use client";
import React, { ReactElement, ReactNode } from "react";
import { create } from "zustand";

export interface StepProps {
  name: string;
  children: ReactNode;
}

export interface FunnelProps {
  children: ReactElement<StepProps>[];
}

interface FunnelState {
  currentStep: string;
  setStep: (step: string) => void;
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  initializeStep: (step: string) => void;
}

const useFunnelStore = create<FunnelState>((set) => ({
  currentStep: "step1",
  setStep: (step) => set({ currentStep: step }),
  formData: {},
  setFormData: (data) => set({ formData: data }),
  initializeStep: (step) => set({ currentStep: step }),
}));

export const useFunnel = (defaultStep: string) => {
  const { currentStep, setStep, formData, setFormData, initializeStep } =
    useFunnelStore();

  React.useEffect(() => {
    initializeStep(defaultStep);
  }, [defaultStep, initializeStep]);

  const Step = (props: StepProps): ReactElement => {
    return <>{props.children}</>;
  };

  const Funnel = ({ children }: FunnelProps) => {
    const targetStep = children.find(
      (childStep) => childStep.props.name === currentStep
    );
    return <>{targetStep}</>;
  };

  return { Funnel, Step, setStep, currentStep, formData, setFormData } as const;
};
