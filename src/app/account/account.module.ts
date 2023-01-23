import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";

import { ToastsContainer } from "./login/toasts-container.component";
import { NgSelectModule } from "@ng-select/ng-select";

import { AccountRoutingModule } from "./account-routing.module";
import { LoginComponent } from "./login/login.component";
import { JwtInterceptor } from "../core/helpers/jwt.interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

@NgModule({
	declarations: [LoginComponent, ToastsContainer],
	imports: [CommonModule, ReactiveFormsModule, FormsModule, AccountRoutingModule, NgbToastModule, NgSelectModule],
	providers: [
		{
			useClass: JwtInterceptor,
			multi: true,
			provide: HTTP_INTERCEPTORS,
		},
	],
})
export class AccountModule {}
