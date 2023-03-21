import { FormControl } from "@angular/forms";

export interface UserModel {
	sno?: FormControl<number | null>;
	staffId?: FormControl<number | null>;
	fullName?: FormControl<string | null>;
	userName?: FormControl<string | null>;
	jobTitle?: FormControl<string | null>;
	phoneNo?: FormControl<string | null>;
	email?: FormControl<string | null>;
	branch?: FormControl<string | null>;
	pass?: FormControl<string | null>;
	savedUser?: FormControl<string | null>;
	savedDate?: FormControl<Date | null>;
	updateUser?: FormControl<string | null>;
	updateDate?: FormControl<Date | null>;
	DDSecurityRole?: FormControl<string | null>;
	securityRoles?: FormControl<string[] | null>;
}

export interface UserModelData {
	sno?: number | null;
	staffId?: number | null;
	fullName?: string | null;
	userName?: string | null;
	jobTitle?: string | null;
	phoneNo?: string | null;
	email?: string | null;
	branch?: string | null;
	pass?: string | null;
	savedUser?: string | null;
	savedDate?: Date | null;
	updateUser?: string | null;
	updateDate?: Date | null;
	DDSecurityRole?: string | null;
	securityRoles?: string[] | null;
}
