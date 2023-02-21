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
	securityRoles?: FormArray<FormControl<string>>;
}
