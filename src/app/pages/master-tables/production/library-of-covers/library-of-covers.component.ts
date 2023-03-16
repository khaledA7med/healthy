import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";

@Component({
	selector: "app-library-of-covers",
	templateUrl: "./library-of-covers.component.html",
	styleUrls: ["./library-of-covers.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class LibraryOfCoversComponent implements OnInit {
	constructor() {}
	searchURI: string = ApiRoutes.masterTables.production.libraryOfCovers.search;
	saveURI: string = ApiRoutes.masterTables.production.libraryOfCovers.save;
	editURI: string = ApiRoutes.masterTables.production.libraryOfCovers.edit;
	deleteURI: string = ApiRoutes.masterTables.production.libraryOfCovers.delete;
	ngOnInit(): void {}
}
