export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // 010xxxxxxxx 형식 검증 (하이픈 제거 후 검증)
  const phoneRegex = /^010\d{8}$/;
  return phoneRegex.test(phoneNumber.replace(/\D/g, ''));
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  // 숫자만 추출
  const numbers = phoneNumber.replace(/\D/g, '');

  // 010으로 시작하지 않으면 010 추가
  if (numbers.length === 8 && !numbers.startsWith('010')) {
    return `010${numbers}`;
  }

  // 010xxxxxxxx 형식으로 반환
  if (numbers.length === 11 && numbers.startsWith('010')) {
    return numbers;
  }

  return numbers;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 길이 검증 (10~20자)
  if (password.length < 10) {
    errors.push('비밀번호는 10자 이상이어야 합니다.');
  } else if (password.length > 20) {
    errors.push('비밀번호는 20자 이하여야 합니다.');
  }

  // 영문자 포함 검증
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('영문자를 포함해야 합니다.');
  }

  // 숫자 포함 검증
  if (!/\d/.test(password)) {
    errors.push('숫자를 포함해야 합니다.');
  }

  // 특수문자 포함 검증
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('특수문자를 포함해야 합니다.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
