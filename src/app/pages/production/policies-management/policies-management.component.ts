import { Component, OnInit } from "@angular/core";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

@Component({
  selector: "app-policies-management",
  templateUrl: "./policies-management.component.html",
  styleUrls: ["./policies-management.component.scss"],
})
export class PoliciesManagementComponent implements OnInit {
  uiState = {
    routerLink: {
      forms: AppRoutes.Production.create,
    },
    filters: {
      pageNumber: 1,
      pageSize: 50,
    },
  };

  constructor() {}
  ngOnInit(): void {}

  onPageSizeChange() {}
  openFilterOffcanvas() {}
}
