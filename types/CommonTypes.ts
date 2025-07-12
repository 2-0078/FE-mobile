export interface CommonResponseType<T> {
  httpStatus: string;
  isSuccess: boolean;
  message: string;
  code: number;
  result: T;
}

export interface BasePaginationResponseType {
  page: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
  totalPage: number;
  totalElements: number;
}

// 결제 관련 타입들
export interface CreatePaymentRequest {
  amount: number;
  orderName: string;
}

export interface CreatePaymentResponse {
  httpStatus: {
    error: boolean;
    is1xxInformational: boolean;
    is3xxRedirection: boolean;
    is4xxClientError: boolean;
    is5xxServerError: boolean;
    is2xxSuccessful: boolean;
  };
  isSuccess: boolean;
  message: string;
  code: number;
  result: {
    orderId: string;
    customerKey: string;
    amount: number;
    paymentUrl?: string; // 백엔드에서 결제 URL을 제공할 경우
  };
}

export interface ConfirmPaymentRequest {
  paymentType: string;
  orderId: string;
  paymentKey: string;
  amount: number;
}

export interface ConfirmPaymentResponse {
  httpStatus: {
    error: boolean;
    is1xxInformational: boolean;
    is3xxRedirection: boolean;
    is4xxClientError: boolean;
    is5xxServerError: boolean;
    is2xxSuccessful: boolean;
  };
  isSuccess: boolean;
  message: string;
  code: number;
  result: {
    paymentKey: string;
    orderId: string;
    amount: number;
    status: string;
    method: string;
    approvedAt: string;
  };
}
