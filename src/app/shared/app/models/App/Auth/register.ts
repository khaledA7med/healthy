import { FormControl } from "@angular/forms";

export interface IRegister {
  phone?: FormControl<string | null>;
  password?: FormControl<string | null>;
  password_confirmation?: FormControl<string | null>;
  address_ar?: FormControl<string | null>;
  gender?: FormControl<string | null>;
  img?: FormControl<string | null>;
  date_of_birth?: FormControl<Date | null>;
  name?: FormControl<string | null>;
  address?: FormControl<string | null>;
  email?: FormControl<string | null>;
  name_ar?: FormControl<string | null>;
}

export interface IRegisterData {
  phone?: string;
  password?: string;
  password_confirmation?: string;
  address_ar?: string;
  gender?: string;
  img?: string;
  date_of_birth?: Date;
  name?: string;
  address?: string;
  email?: string;
  name_ar?: string;
}
