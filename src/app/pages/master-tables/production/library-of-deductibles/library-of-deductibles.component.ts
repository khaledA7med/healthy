import { Component, OnInit } from "@angular/core";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";

@Component({
  selector: "app-library-of-deductibles",
  templateUrl: "./library-of-deductibles.component.html",
  styleUrls: ["./library-of-deductibles.component.scss"],
})
export class LibraryOfDeductiblesComponent implements OnInit {
  constructor() {}
  searchURI: string =
    ApiRoutes.masterTables.production.libraryOfDeductibles.search;
  saveURI: string = ApiRoutes.masterTables.production.libraryOfDeductibles.save;
  editURI: string = ApiRoutes.masterTables.production.libraryOfDeductibles.edit;
  deleteURI: string =
    ApiRoutes.masterTables.production.libraryOfDeductibles.delete;
  ngOnInit(): void {}
}
