import { FormControl } from "@angular/forms";

export interface IVerify {
  code?: FormControl<string | null>;
  notification_token?: FormControl<string | null>;
}

export interface IVerifyData {
  code?: string;
  notification_token?: string;
}
