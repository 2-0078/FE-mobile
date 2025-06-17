"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import PageWrapper from "@/components/layout/PageWrapper";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("ronaldosilva@gmail.com");
  const [password, setPassword] = useState("password123");

  return (
    <PageWrapper>
      <Header isAlert={false} title="LOGIN" />

      {/* Form Fields */}
      <div className="px-6 flex-1">
        <div className="space-y-6">
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
              type="email"
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
        </div>
      </div>

      {/* Login Button */}
      <div className="absolute bottom-20 left-0 right-0 p-6">
        <Button className="w-full bg-custom-light-blue font-bold text-lg py-4 rounded-full h-14">
          LOGIN
        </Button>
      </div>
      {/* SIGNUP Button */}
      <div className="absolute bottom-4 left-0 right-0 p-6">
        <Button className="w-full bg-custom-green text-black font-bold text-lg py-4 rounded-full h-14">
          SIGN UP
        </Button>
      </div>
    </PageWrapper>
  );
}
