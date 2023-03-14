import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

// Login Auth
import { AuthenticationService } from "../../core/services/auth.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IUser, LoginResponse } from "src/app/core/models/iuser";
import { Subscription } from "rxjs";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { localStorageKeys } from "src/app/core/models/localStorageKeys";
import { HttpErrorResponse } from "@angular/common/http";

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
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    public message: MessagesService
  ) {}

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
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
    if (!this.loginForm.valid) return;
    else {
      let sub = this.auth.login(data).subscribe(
        (res: IBaseResponse<LoginResponse>) => {
          if (res.status) {
            localStorage.setItem(localStorageKeys.JWT, res.data?.accessToken!);
            localStorage.setItem(
              localStorageKeys.Refresh,
              res.data?.refreshToken!
            );
            this.message.toast("Logged In Successfully", "success");
            this.router.navigate([this.returnUrl]);
          } else this.message.toast(res.message!, "error");
        },
        (err: HttpErrorResponse) =>
          this.message.popup("Error", err.error.message, "error")
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
