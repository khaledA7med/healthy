import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

@Component({
  selector: "app-business-development-management",
  templateUrl: "./business-development-management.component.html",
  styleUrls: ["./business-development-management.component.scss"],
})
export class BusinessDevelopmentManagementComponent
  implements OnInit, OnDestroy
{
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

  // To Unsubscription
  subscribes: Subscription[] = [];
  constructor() {}

  ngOnInit(): void {}

  openFilterOffcanvas() {}
  onPageSizeChange() {}

  ngOnDestroy(): void {}
}
