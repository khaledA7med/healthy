import { IBaseFilters } from "../App/IBaseFilters";

export interface IEmailClient {
	status?: string;
	sNo?: string;
	fullName?: string;
	producer?: string;
}
export interface IClientContact {
	sNo?: number | null;
	branch?: string | null;
	clientID?: number | null;
	contactName?: string | null;
	mobile?: string | null;
	lineOfBusiness?: string | null;
	department?: string | null;
	extension?: string | null;
	position?: string | null;
	mainContact?: number | null;
	tele?: string | null;
	email?: string | null;
	savedUser?: string | null;
	address?: string | null;
}

export interface IEmailClientContact extends IBaseFilters, IClientContact {}
