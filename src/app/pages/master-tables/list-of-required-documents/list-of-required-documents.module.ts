import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListOfRequiredDocumentsRoutingModule } from "./list-of-required-documents-routing.module";
import { ClientsDocumentsComponent } from "./clients-documents/clients-documents.component";
import { ClaimsDocumentsComponent } from "./claims-documents/claims-documents.component";
import { ProductionDocumentsComponent } from "./production-documents/production-documents.component";

@NgModule({
	declarations: [],
	imports: [CommonModule, ListOfRequiredDocumentsRoutingModule],
})
export class ListOfRequiredDocumentsModule {}
