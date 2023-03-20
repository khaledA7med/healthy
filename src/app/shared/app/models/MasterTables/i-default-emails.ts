import { FormControl } from "@angular/forms";

export interface IDefaultEmails {
  category?: FormControl<string | null>;
  item?: FormControl<string | null>;
}
export interface IDefaultEmailsData {
  category?: string | null;
  item?: string | null;
}
