import { IDocumentList } from "./../App/IDocument";
export interface IEmailResponse {
  mailTo?: string;
  subject?: string;
  body?: string;
  attachments: IDocumentList[];
  mailToList?: [];
  emailCC?: [];
  emailBCC?: [];
  mailListString?: string;
  emailCCString?: string;
  emailBCCString?: string;
  priority?: string;
}
