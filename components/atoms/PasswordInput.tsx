'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/floating-input';

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
}

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  error = false,
  required = false,
  placeholder,
  helperText,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <FloatingInput
        id={id}
        name={name}
        label={label}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required={required}
        error={error}
        placeholder={placeholder}
        helperText={helperText}
        autoComplete="new-password"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-custom-gray-300 hover:text-custom-green"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
}
