import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-library-of-covers",
	templateUrl: "./library-of-covers.component.html",
	styleUrls: ["./library-of-covers.component.scss"],
})
export class LibraryOfCoversComponent implements OnInit {
	constructor() {}
	searchURI: string = "/MasterTables/LibraryofCovers/Search";
	saveURI: string = "/MasterTables/LibraryofCovers/Save";
	editURI: string = "/MasterTables/LibraryofCovers/Edit";
	deleteURI: string = "/MasterTables/LibraryofCovers/Delete";
	ngOnInit(): void {}
}
