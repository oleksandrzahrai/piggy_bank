export interface AppResponse<T> {
  statusCode: number;
  error?: object | string;
  message?: string;
  data: T;
  timestamp?: string;
  path?: string;
}
