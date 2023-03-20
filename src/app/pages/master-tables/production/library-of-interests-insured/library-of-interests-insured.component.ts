import { Component, OnInit } from "@angular/core";
import { ApiRoutes } from "src/app/shared/app/routers/ApiRoutes";

@Component({
  selector: "app-library-of-interests-insured",
  templateUrl: "./library-of-interests-insured.component.html",
  styleUrls: ["./library-of-interests-insured.component.scss"],
})
export class LibraryOfInterestsInsuredComponent implements OnInit {
  constructor() {}
  searchURI: string =
    ApiRoutes.masterTables.production.libraryOfInterestsInsured.search;
  saveURI: string =
    ApiRoutes.masterTables.production.libraryOfInterestsInsured.save;
  editURI: string =
    ApiRoutes.masterTables.production.libraryOfInterestsInsured.edit;
  deleteURI: string =
    ApiRoutes.masterTables.production.libraryOfInterestsInsured.delete;
  ngOnInit(): void {}
}
