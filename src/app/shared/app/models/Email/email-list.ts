import { IEmailData } from "./email-data";
export interface IEmailList {
  primary: IEmailData[];
  promotions: IEmailData[];
  social: IEmailData[];
}
