import { Component, OnInit } from "@angular/core";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";

@Component({
	selector: "app-library-of-terms",
	templateUrl: "./library-of-terms.component.html",
	styleUrls: ["./library-of-terms.component.scss"],
})
export class LibraryOfTermsComponent implements OnInit {
	constructor() {}
	searchURI: string = ApiRoutes.masterTables.production.libraryOfTermsAndConditions.search;
	saveURI: string = ApiRoutes.masterTables.production.libraryOfTermsAndConditions.save;
	editURI: string = ApiRoutes.masterTables.production.libraryOfTermsAndConditions.edit;
	deleteURI: string = ApiRoutes.masterTables.production.libraryOfTermsAndConditions.delete;
	ngOnInit(): void {}
}
