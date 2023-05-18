export interface IBaseResponse<T> {
  message?: string;
  status?: boolean;
  statusCode?: number;
  validationErrors?: string[];
  data?: T;
}

export interface IBaseResponse2<T> {
  responseMessage?: string;
  isSuccess?: boolean;
  statusCode?: number;
  validationErrors?: string[];
  accessToken?: string;
  refreshToken?: string;
  expiration?: number;
}
