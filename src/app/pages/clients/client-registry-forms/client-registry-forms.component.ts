import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessagesService } from "src/app/shared/services/messages.service";
// import { Subscription } from "rxjs";
import { ToastService } from "src/app/account/login/toast-service";
import { ClientsService } from "src/app/shared/services/clients/clients.service";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { IClientForms } from "src/app/shared/app/models/Clients/iclientForms";
import { IClientsBankAccount } from "src/app/shared/app/models/Clients/iclientsBankAccountForm";

@Component({
  selector: "app-client-registry-forms",
  templateUrl: "./client-registry-forms.component.html",
  styleUrls: ["./client-registry-forms.component.scss"],
})
export class ClientRegistryFormsComponent implements OnInit {
  clientForm!: FormGroup<IClientForms>;
  submitted = false;
  closeResult = "";

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    // private ClientsService:ClientsService,
    // private router: Router,
    public toastMessgae: ToastService,
    public message: MessagesService,
    private modalService: NgbModal
  ) {}

  openContact(content1: any) {
    this.modalService
      .open(content1, { ariaLabelledBy: "modal-basic-title", size: "lg" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openBankAccount(content2: any) {
    this.modalService
      .open(content2, { ariaLabelledBy: "modal-basic-title", size: "lg" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((res) => {
      console.log(res.get("id"));
    });

    this.clientForm = new FormGroup<IClientForms>({
      fullName: new FormControl("", Validators.required),
      fullNameAr: new FormControl("", Validators.required),
      officalName: new FormControl("", Validators.required),
      clientsBankAccounts: new FormArray<FormGroup<IClientsBankAccount>>([]),
    });
  }
  get f() {
    return this.clientForm.controls;
  }
  get bankControlArray(): FormArray {
    return this.clientForm.get("clientsBankAccounts") as FormArray;
  }
  formControl(i: number, control: string): AbstractControl {
    return this.bankControlArray.controls[i].get(control)!;
  }
  addBank() {
    if (this.f.clientsBankAccounts?.invalid) {
      this.f.clientsBankAccounts?.markAllAsTouched();
      return;
    }
    let bank = new FormGroup<IClientsBankAccount>({
      arabicName: new FormControl(null),
      clientID: new FormControl(null),
      bankName: new FormControl(null, Validators.required),
      branch: new FormControl(null),
      iban: new FormControl(null),
      swiftCode: new FormControl(null),
      fullName: new FormControl(null, Validators.required),
      stauts: new FormControl(null),
    });
    bank.reset();
    this.f.clientsBankAccounts?.push(bank);
    this.bankControlArray.updateValueAndValidity();
  }

  remove(i: number) {
    this.bankControlArray.removeAt(i);
  }

  onSubmit(clientForm: FormGroup<IClientForms>) {
    this.submitted = true;
    if (!clientForm) {
      return;
    }
    console.log(clientForm.value);
  }
}
