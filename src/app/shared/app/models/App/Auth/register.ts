import { FormControl } from "@angular/forms";

export interface IRegister {
  phone?: FormControl<string | null>;
  password?: FormControl<string | null>;
  password_confirmation?: FormControl<string | null>;
  gender?: FormControl<string | null>;
  img?: FormControl<string | null>;
  date_of_birth?: FormControl<string | null>;
  name?: FormControl<string | null>;
  address?: FormControl<string | null>;
  email?: FormControl<string | null>;
}

export interface IRegisterData {
  phone?: string;
  password?: string;
  password_confirmation?: string;
  gender?: string;
  img?: string;
  date_of_birth?: string;
  name?: string;
  address?: string;
  email?: string;
}
