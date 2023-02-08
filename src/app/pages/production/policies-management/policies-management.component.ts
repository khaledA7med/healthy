import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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

	constructor(private _Router: Router) {}
	ngOnInit(): void {}

	onPageSizeChange() {}
	openFilterOffcanvas() {}

	route: string = AppRoutes.Production.base;
	openPolicyDetailsTest(sno: number) {
		this._Router.navigate([{ outlets: { details: [this.route, sno] } }]);
	}
}
