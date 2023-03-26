import { IBaseFilters } from "../App/IBaseFilters";

export interface IEmailClient {
	status?: string;
	sNo?: string;
	fullName?: string;
	producer?: string;
}
export interface IEmailClientContact extends IBaseFilters {
	sNo?: number;
	branch?: string;
	clientID?: number;
	contactName?: string;
	mobile?: string;
	lineOfBusiness?: string;
	department?: string;
	extension?: string;
	position?: string;
	mainContact?: number;
	tele?: string;
	email?: string;
	savedUser?: string;
	address?: string;
}
