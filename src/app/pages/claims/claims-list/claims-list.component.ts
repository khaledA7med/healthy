import { Component, OnInit } from "@angular/core";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

@Component({
  selector: "app-claims-list",
  templateUrl: "./claims-list.component.html",
  styleUrls: ["./claims-list.component.scss"],
})
export class ClaimsListComponent implements OnInit {
  uiState = {
    routerLink: {
      forms: AppRoutes.Claims.create,
    },
    filters: {
      pageSize: 50,
    },
  };
  constructor() {}

  ngOnInit(): void {}
}
