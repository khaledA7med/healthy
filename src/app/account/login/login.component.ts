import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

// Login Auth
import { AuthenticationService } from "../../core/services/auth.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IUser, LoginResponse } from "src/app/core/models/iuser";
import { Subscription } from "rxjs";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { localStorageKeys } from "src/app/core/models/localStorageKeys";
import { environment } from "src/environments/environment";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import {
  IRegister,
  IRegisterData,
} from "src/app/shared/app/models/App/Auth/register";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None,
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

  RegisterFormSubmitted = false as boolean;
  RegisterModal!: NgbModalRef;
  RegisterForm!: FormGroup<IRegister>;
  @ViewChild("registerContent") registerContent!: TemplateRef<any>;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    public message: MessagesService,
    private EventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initRegisterForm();

    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.email, Validators.required]],
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
      // db: this.loginForm.controls["dbName"].value,
      email: this.loginForm.controls["email"].value,
      password: this.loginForm.controls["password"].value,
    };
    if (!this.loginForm.valid) {
      this.EventService.broadcast(reserved.isLoading, true);
      return;
    } else {
      let sub = this.auth.login(data).subscribe((res) => {
        if (res) {
          localStorage.setItem(localStorageKeys.JWT, res.data?.token!);
          this.EventService.broadcast(reserved.isLoading, false);
          this.message.toast("Logged In Successfully", "success");
          this.router.navigate([this.returnUrl]);
        } else this.message.toast(res, "error");
      });
      this.subsribes.push(sub);
    }
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  openRegisterDialoge() {
    this.RegisterModal = this.modalService.open(this.registerContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });
    this.RegisterModal.hidden.subscribe(() => {
      this.resetRegisterForm();
      this.RegisterFormSubmitted = false;
    });
  }

  initRegisterForm() {
    this.RegisterForm = new FormGroup<IRegister>({
      name: new FormControl(null, Validators.required),
      name_ar: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      password_confirmation: new FormControl(null, Validators.required),
      phone: new FormControl(null),
      address: new FormControl(null),
      address_ar: new FormControl(null),
      gender: new FormControl(null),
      date_of_birth: new FormControl(null),
    });
  }

  get ff() {
    return this.RegisterForm.controls;
  }

  validationChecker(): boolean {
    if (this.RegisterForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  submitRegisterData(form: FormGroup<IRegister>) {
    this.RegisterFormSubmitted = true;
    let val = form.getRawValue();
    const formData = new FormData();

    formData.append("name", val.name!);
    formData.append("name_ar", val.name_ar! ?? "");
    formData.append("password", val.password! ?? "");
    formData.append("email", val.email!);
    formData.append("password_confirmation", val.password_confirmation!);
    formData.append("address", val.address! ?? "");
    formData.append("address_ar", val.address_ar! ?? "");
    formData.append("gender", val.gender! ?? "");
    formData.append("phone", val.phone! ?? "");

    this.EventService.broadcast(reserved.isLoading, true);
    let sub = this.auth.register(formData).subscribe((res) => {
      if (res.body?.status) {
        this.RegisterModal.dismiss();
        this.message.toast(res.body?.message!, "success");
      } else this.message.popup("Sorry!", res.body?.message!, "warning");
      this.EventService.broadcast(reserved.isLoading, false);
      window.location.reload();
    });
    this.subsribes.push(sub);
  }

  resetRegisterForm() {
    this.RegisterForm.reset();
  }
  ngOnDestroy(): void {
    this.subsribes && this.subsribes.forEach((s) => s.unsubscribe());
  }
}
