"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function NicknameSection({
  onNext,
}: {
  onNext: (data: { nickname: string }) => void;
}) {
  const [nickname, setNickname] = useState("");

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="nickname"
            className="text-custom-green text-sm font-medium"
          >
            닉네임
          </Label>
          <Input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
            className="border border-custom-gray-300 rounded-full px-6 py-4 placeholder:text-custom-gray-200 focus:border-custom-green focus:ring-0 h-14"
          />
        </div>
      </div>

      <div className="fixed bottom-5 left-0 right-0 p-6">
        <Button
          type="button"
          className="w-full bg-custom-green text-black font-bold text-lg py-4 rounded-full h-14"
          onClick={() => onNext({ nickname })}
          disabled={!nickname.trim()}
        >
          회원가입
        </Button>
      </div>
    </div>
  );
}
