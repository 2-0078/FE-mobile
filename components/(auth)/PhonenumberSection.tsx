"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleSendVerification = () => {
    // TODO: 실제 인증번호 발송 로직 구현
    setIsVerificationSent(true);
  };

  const handleVerifyCode = () => {
    // TODO: 실제 인증번호 확인 로직 구현
    setIsVerified(true);
  };

  const isFormValid = name && birthdate && gender && phoneNumber;

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-custom-green text-sm font-medium"
          >
            이름
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-custom-gray-300 rounded-full px-6 py-4 placeholder:text-custom-gray-200 focus:border-custom-green focus:ring-0 h-14"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="birthday"
            className="text-custom-green text-sm font-medium"
          >
            생년월일
          </Label>
          <Input
            id="birthdate"
            type="text"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            placeholder="YYYYMMDD"
            className="border border-custom-gray-300 rounded-full px-6 py-4 placeholder:text-custom-gray-200 focus:border-custom-green focus:ring-0 h-14"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="gender"
            className="text-custom-green text-sm font-medium"
          >
            성별
          </Label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border border-custom-gray-300 rounded-full px-6 py-4 focus:border-custom-green h-14 appearance-none"
          >
            <option value="" disabled>
              선택하세요
            </option>
            <option value="남성" className="text-black">
              남성
            </option>
            <option value="여성" className="text-black">
              여성
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="phonenumber"
            className="text-custom-green text-sm font-medium"
          >
            휴대전화 번호
          </Label>
          <div className="flex gap-2">
            <Input
              id="phonenumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="01012345678"
              className="border border-custom-gray-300 rounded-full px-6 py-4 placeholder:text-custom-gray-200 focus:border-custom-green focus:ring-0 h-14"
            />
            <Button
              onClick={handleSendVerification}
              type="button"
              disabled={!isFormValid}
              className="bg-custom-green text-black font-bold px-4 rounded-full h-14 whitespace-nowrap disabled:opacity-50"
            >
              인증하기
            </Button>
          </div>
        </div>

        {isVerificationSent && (
          <div className="space-y-2">
            <Label
              htmlFor="verificationCode"
              className="text-custom-green text-sm font-medium"
            >
              인증번호
            </Label>
            <div className="flex gap-2">
              <Input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증번호 6자리"
                className="border border-custom-gray-300 rounded-full px-6 py-4 placeholder:text-custom-gray-200 focus:border-custom-green focus:ring-0 h-14"
              />
              <Button
                type="button"
                onClick={handleVerifyCode}
                className="bg-custom-green text-black font-bold px-4 rounded-full h-14 whitespace-nowrap"
              >
                확인
              </Button>
            </div>
          </div>
        )}
      </div>

      {isVerified && (
        <div className="mt-8">
          <Button
            type="button"
            className="w-full bg-custom-green text-black font-bold text-lg py-4 rounded-full h-14"
            onClick={() => onNext({ phoneNumber, name, birthdate, gender })}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
