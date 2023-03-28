import { FormControl } from "@angular/forms";
import { IDocumentList } from "./../App/IDocument";
export interface IEmailResponse {
	MailToList?: FormControl<string[] | null>;
	EmailCC?: FormControl<string[] | null>;
	EmailBCC?: FormControl<string[] | null>;
	Subject?: FormControl<string | null>;
	Body?: FormControl<string | null>;
	Attachments?: FormControl<IDocumentList[] | null>;
	Priority?: FormControl<string | null>;
}
