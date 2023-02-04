import { Component, OnInit } from "@angular/core";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

@Component({
  selector: "app-business-development-management",
  templateUrl: "./business-development-management.component.html",
  styleUrls: ["./business-development-management.component.scss"],
})
export class BusinessDevelopmentManagementComponent implements OnInit {
  uiState = {
    view: "card",
    routerLink: {
      forms: AppRoutes.BusinessDevelopment.create,
    },
    filters: {
      pageNumber: 1,
      pageSize: 50,
      orderBy: "sNo",
      orderDir: "asc",
    },
  };

  constructor() {}

  ngOnInit(): void {}

  openFilterOffcanvas() {}
  onPageSizeChange() {}
}
