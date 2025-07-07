'use server';

const API_BASE_URL = 'https://api.pieceofcake.site';

export interface ValidationResponse {
  httpStatus: string;
  isSuccess: boolean;
  message: string;
  code: number;
  result: {
    available: boolean;
  };
}

export const checkEmailAvailability = async (
  email: string
): Promise<ValidationResponse | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/member-service/api/v1/check-email?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to check email availability:', response.status);
      return null;
    }

    const data: ValidationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking email availability:', error);
    return null;
  }
};

export const checkNicknameAvailability = async (
  nickname: string
): Promise<ValidationResponse | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/member-service/api/v1/check-nickname?nickname=${encodeURIComponent(nickname)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to check nickname availability:', response.status);
      return null;
    }

    const data: ValidationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking nickname availability:', error);
    return null;
  }
};
