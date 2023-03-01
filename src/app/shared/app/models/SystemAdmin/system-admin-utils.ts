import { FormControl } from "@angular/forms";

export enum SystemAdminStatus {
	Active = "Active",
	Disable = "Disable",
}

export interface UserDetails {
	empNo?: number;
	fullNameEn?: string;
	position?: string;
	email?: string;
	mobile?: string;
	branch?: string;
	costCentersDivision?: string;
	costCentersDepartment?: string;
}

export interface IUserRolesForm {
	securityRole?: FormControl<string | null>;
	securityRoleDescription?: FormControl<string | null>;
}

export interface IUserRoles {
	sno?: number;
	securityRole?: string;
	securityRoleDescription?: string;
	savedUser?: string;
}

export interface privilegeRole {
	control: FormControl<boolean | null>;
	name: string;
	label: string;
}
