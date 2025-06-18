"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import PageWrapper from "@/components/layout/PageWrapper";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  return (
    <PageWrapper>
      <Header isAlert={false} title="LOGIN" />

      <form
        action={async () => {
          const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });
          if (res?.error) {
            setError("아이디 또는 비밀번호가 일치하지 않습니다.");
            return;
          }
          if (res?.ok) {
            const callbackUrl = searchParams.get("callbackUrl");
            router.push(callbackUrl || "/");
            router.refresh();
          }
        }}
      >
        {/* Email Field */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-custom-green text-sm font-medium"
          >
            Email Address
          </Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-custom-gray-300 rounded-full px-6 py-4 pr-14 placeholder:text-custom-gray-200 focus:border-custom-green focus:ring-0 h-14"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-custom-green text-sm font-medium"
          >
            Password
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
        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}
        {/* Login Button */}
        <div className="absolute bottom-24 left-0 right-0 p-6">
          <Button
            type="submit"
            className="w-full bg-custom-light-blue/70 font-bold text-lg py-4 rounded-full h-14"
          >
            로그인
          </Button>
        </div>
      </form>
      {/* SIGNUP Button */}
      <div className="absolute bottom-4 left-0 right-0 p-6">
        <Button
          onClick={() => router.push("/signup")}
          className="w-full bg-custom-green text-black font-bold text-lg py-4 rounded-full h-14"
        >
          회원가입
        </Button>
      </div>
    </PageWrapper>
  );
}
