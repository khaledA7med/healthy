import { Component, OnInit } from "@angular/core";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";

@Component({
	selector: "app-library-of-warranties",
	templateUrl: "./library-of-warranties.component.html",
	styleUrls: ["./library-of-warranties.component.scss"],
})
export class LibraryOfWarrantiesComponent implements OnInit {
	constructor() {}
	searchURI: string = ApiRoutes.masterTables.production.libraryOfWarranties.search;
	saveURI: string = ApiRoutes.masterTables.production.libraryOfWarranties.save;
	editURI: string = ApiRoutes.masterTables.production.libraryOfWarranties.edit;
	deleteURI: string = ApiRoutes.masterTables.production.libraryOfWarranties.delete;
	ngOnInit(): void {}
}
