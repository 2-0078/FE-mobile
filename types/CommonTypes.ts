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
