'use server';

const API_BASE_URL = 'https://api.pieceofcake.site';

export interface SendVerificationCodeRequest {
  phoneNumber: string;
  purpose: 'SIGN_UP';
}

export interface SendVerificationCodeResponse {
  httpStatus: string;
  isSuccess: boolean;
  message: string;
  code: number;
  result?: any;
}

export interface VerifyCodeRequest {
  phoneNumber: string;
  purpose: 'SIGN_UP';
  verificationCode: string;
}

export interface VerifyCodeResponse {
  httpStatus: string;
  isSuccess: boolean;
  message: string;
  code: number;
  result?: any;
}

export const sendVerificationCode = async (
  phoneNumber: string
): Promise<SendVerificationCodeResponse | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth-service/api/v1/phone/send-code`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          purpose: 'SIGN_UP',
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to send verification code:', response.status);
      return null;
    }

    const data: SendVerificationCodeResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending verification code:', error);
    return null;
  }
};

export const verifyCode = async (
  phoneNumber: string,
  verificationCode: string
): Promise<VerifyCodeResponse | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth-service/api/v1/phone/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          purpose: 'SIGN_UP',
          verificationCode,
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to verify code:', response.status);
      return null;
    }

    const data: VerifyCodeResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying code:', error);
    return null;
  }
};

// 일반 함수로 signin 구현 (NextAuth용)
export const signin = async (email: string, password: string) => {
  try {
    console.log('Signin attempt for email:', email);

    const response = await fetch(
      `${process.env.BASE_API_URL}/auth-service/api/v1/login`,
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const res = await response.json();
    console.log('API Response:', res);

    // API 응답에서 에러 메시지 추출
    if (!res.isSuccess) {
      const errorMessage = res.message || res.error || '로그인에 실패했습니다.';
      console.log('Login failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('Login successful');
    return res;
  } catch (error) {
    console.log('Signin error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('로그인 중 오류가 발생했습니다.');
  }
};

// Server action으로 signin 구현
export const signinAction = async (email: string, password: string) => {
  'use server';

  try {
    console.log('Signin action attempt for email:', email);

    const response = await fetch(
      `${process.env.BASE_API_URL}/auth-service/api/v1/login`,
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const res = await response.json();
    console.log('API Response:', res);

    // API 응답에서 에러 메시지 추출
    if (!res.isSuccess) {
      const errorMessage = res.message || res.error || '로그인에 실패했습니다.';
      console.log('Login failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('Login successful');
    return res;
  } catch (error) {
    console.log('Signin error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('로그인 중 오류가 발생했습니다.');
  }
};

export const signup = async (data: any) => {
  try {
    const year = data.birthdate.substring(0, 4);
    const month = data.birthdate.substring(4, 6);
    const day = data.birthdate.substring(6, 8);
    data.birthdate = `${year}-${month}-${day}T00:00:00.000Z`;

    const response = await fetch(
      `${process.env.BASE_API_URL}/auth-service/api/v1/signup`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const res = await response.json();
    console.log('Signup response:', res);

    // API 응답에서 에러 메시지 추출
    if (!res.isSuccess) {
      const errorMessage =
        res.message || res.error || '회원가입에 실패했습니다.';
      throw new Error(errorMessage);
    }

    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('회원가입 중 오류가 발생했습니다.');
  }
};
