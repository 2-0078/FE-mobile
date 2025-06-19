export interface CommonResponseType<T> {
  httpStatus: string;
  isSuccess: boolean;
  message: string;
  code: number;
  result: T;
}
