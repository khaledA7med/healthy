import { FormArray, FormControl } from "@angular/forms";

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
	securityRoles?: FormArray<FormControl<string | null>> | FormArray<never>;
}

export interface UserModelData {
	sno?: number;
	staffId?: number;
	fullName?: string;
	userName?: string;
	jobTitle?: string;
	phoneNo?: string;
	email?: string;
	branch?: string;
	pass?: string;
	savedUser?: string;
	savedDate?: Date;
	updateUser?: string;
	updateDate?: Date;
	DDSecurityRole?: string;
	securityRoles?: string[];
}
