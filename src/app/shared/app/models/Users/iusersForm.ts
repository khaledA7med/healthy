import { FormControl } from "@angular/forms";

export interface IUsersForm {
  firstName?: FormControl<string | null>;
  surname?: FormControl<string | null>;
  email?: FormControl<string | null>;
}

export interface IUsersData {
  firstName?: string | null;
  surname?: string | null;
  email?: string | null;
}
