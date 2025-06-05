"use client";
import { EyeOff, Eye } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function SignupInfoSection({
  onNext,
}: {
  onNext: (data: any) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("ronaldosilva@gmail.com");
  const [password, setPassword] = useState("password123");
  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-custom-green text-sm font-medium"
          >
            아이디 (이메일)
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-custom-gray-300 rounded-full px-6 py-4 pr-14 placeholder:text-custom-gray-200 focus:border-custom-green focus:ring-0 h-14"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-custom-green text-sm font-medium"
          >
            비밀번호
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-custom-gray-300 rounded-full px-6 py-4 pr-14 placeholder:text-custom-gray-200 focus:border-custom-green focus:ring-0 h-14"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-custom-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-5 left-0 right-0 p-6">
        <Button
          type="button"
          className="w-full bg-custom-green text-black font-bold text-lg py-4 rounded-full h-14"
          onClick={() => onNext({ email, password })}
        >
          다음
        </Button>
      </div>
    </>
  );
}
