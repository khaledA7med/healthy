export interface DataBaseNames {
  id: number;
  name: string;
}

export interface IUser {
  db?: { id: number; name: string }[];
  userName?: string;
  password?: string;
  roles?: string;
  branch?: string;
  connectTo?: string;
}

export interface LoginResponse {
  accessToken?: string;
  accessTokenExpiry?: number;
  refreshToken?: string;
}

export interface UserAccess {
  token?: string;
  email?: string;
  name?: string;
  Branch?: string;
  UserId?: string;
  Role?: string[];
  DbConnection?: string;
}

export interface IPrivileges {
  Clients?: string[];
  Production?: string[];
  CustomerService?: string[];
  BussinessDevelopment?: string[];
  Claims?: string[];
  Alert?: string[];
  MasterTables?: string[];
}
