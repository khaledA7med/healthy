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
}

export interface LoginResponse {
	sNo?: string;
	message?: null;
	isAuthenticated?: boolean;
	username?: string;
	email?: string;
	roles?: string[];
	token?: string;
	expiresOn?: Date;
	refreshToken?: string;
	refreshTokenExpiration?: Date;
}
