export interface DataBaseNames {
  id: number;
  name: string;
}

export interface IUser {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  token?: string;
}

export interface UserAccess {
  token?: string;
  email?: string;
  name?: string;
}
