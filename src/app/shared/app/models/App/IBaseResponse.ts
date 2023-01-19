export interface IBaseResponse<T> {
	message?: string;
	status?: boolean;
	statusCode?: number;
	validationErrors?: string[];
	data?: T;
}
