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
