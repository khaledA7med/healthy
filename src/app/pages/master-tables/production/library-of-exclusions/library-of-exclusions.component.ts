import { Component, OnInit } from "@angular/core";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";

@Component({
	selector: "app-library-of-exclusions",
	templateUrl: "./library-of-exclusions.component.html",
	styleUrls: ["./library-of-exclusions.component.scss"],
})
export class LibraryOfExclusionsComponent implements OnInit {
	constructor() {}
	searchURI: string = ApiRoutes.masterTables.production.libraryOfExclusions.search;
	saveURI: string = ApiRoutes.masterTables.production.libraryOfExclusions.save;
	editURI: string = ApiRoutes.masterTables.production.libraryOfExclusions.edit;
	deleteURI: string = ApiRoutes.masterTables.production.libraryOfExclusions.delete;
	ngOnInit(): void {}
}
