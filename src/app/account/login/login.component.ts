import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

// Login Auth
import { AuthenticationService } from "../../core/services/auth.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IUser } from "src/app/core/models/iuser";
import { Subscription } from "rxjs";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit, OnDestroy {
	// Login Form
	loginForm!: FormGroup;
	submitted = false;
	fieldTextType!: boolean;
	error = "";
	returnUrl!: string;
	subsribes: Subscription[] = [];
	// set the current year
	year: number = new Date().getFullYear();
	dbNames: IUser = {
		db: [
			{ id: 0, name: "Test" },
			{ id: 1, name: "Live" },
			{ id: 2, name: "Migration" },
		],
	};

	constructor(
		private formBuilder: FormBuilder,
		private authenticationService: AuthenticationService,
		private route: ActivatedRoute,
		private router: Router,
		public message: MessagesService
	) {
		// redirect to home if already logged in
		// if (this.authenticationService.currentUserValue) {
		//   this.router.navigate(["/"]);
		// }
	}

	ngOnInit(): void {
		/**
		 * Form Validatyion
		 */
		// if (localStorage.getItem("currentUser")) {
		//   this.router.navigate(["/"]);
		// }
		this.loginForm = this.formBuilder.group({
			dbName: [0, [Validators.required]],
			userName: ["", [Validators.required]],
			password: ["", [Validators.required]],
			rememberMe: [false],
		});

		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.loginForm.controls;
	}

	/**
	 * Form submit
	 */
	onSubmit() {
		this.submitted = true;
		let data: IUser = {
			db: this.loginForm.controls["dbName"].value,
			userName: this.loginForm.controls["userName"].value,
			password: this.loginForm.controls["password"].value,
		};
		if (!this.loginForm.valid) {
			return;
		} else {
			let sub = this.authenticationService.login(data).subscribe(
				(res) => {
					localStorage.setItem("currentUser", JSON.stringify(res));
					this.message.toast("Logged In Successfully", "success");
				},
				(err) => {
					console.log(err);
					this.message.popup("Error", err.error, "error");
				}
			);

			this.subsribes.push(sub);
		}
	}

	/**
	 * Password Hide/Show
	 */
	toggleFieldTextType() {
		this.fieldTextType = !this.fieldTextType;
	}

	ngOnDestroy(): void {
		this.subsribes && this.subsribes.forEach((s) => s.unsubscribe());
	}
}
