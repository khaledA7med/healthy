import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ToastService } from "src/app/account/login/toast-service";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { IClientForms } from "src/app/shared/app/models/Clients/iclientForms";
import { IClientsBankAccount } from "src/app/shared/app/models/Clients/iclientsBankAccountForm";
import { ClientType } from "src/app/shared/app/models/Clients/clientUtil";
import { Subscription } from "rxjs";
import { IClientContact } from "src/app/shared/app/models/Clients/iclientContactForm";

@Component({
  selector: "app-client-registry-forms",
  templateUrl: "./client-registry-forms.component.html",
  styleUrls: ["./client-registry-forms.component.scss"],
})
export class ClientRegistryFormsComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup<IClientForms>;
  submitted = false;
  closeResult = "";

  uiState = {
    clientDetails: {
      clientType: ClientType,
      retail: true,
      corporate: true,
    },
  };

  documentsToUpload = [];
  documentsToDisplay = [];

  test!: string;
  subscribes: Subscription[] = [];
  constructor(
    private route: ActivatedRoute,
    public toastMessgae: ToastService,
    public message: MessagesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe((res) => {
      console.log(res.get("id"));
    });
  }

  //#region Global Configs
  initForm(): void {
    this.formGroup = new FormGroup<IClientForms>({
      // Client Details
      type: new FormControl("", Validators.required),
      fullName: new FormControl("", Validators.required),
      fullNameAr: new FormControl(""),
      producer: new FormControl("", Validators.required),
      relationshipStatus: new FormControl("", Validators.required),
      businessType: new FormControl("", Validators.required),
      channel: new FormControl("", Validators.required),
      interface: new FormControl("", Validators.required),
      screeningResult: new FormControl("", Validators.required),
      officalName: new FormControl("", Validators.required),

      // Retail Type
      idNo: new FormControl("", Validators.required),
      expiryDate: new FormControl(null, Validators.required),
      nationality: new FormControl("", Validators.required),
      sourceofIncome: new FormControl("", Validators.required),

      // Corporate Type
      registrationStatus: new FormControl("", Validators.required),
      businessActivity: new FormControl("", Validators.required),
      marketSegment: new FormControl("", Validators.required),
      commericalNo: new FormControl("", Validators.required),
      dateOfIncorporation: new FormControl(null, Validators.required),
      dateOfIncorporationHijri: new FormControl(null),
      idExpiryDate: new FormControl(null, Validators.required),
      expiryDateHijri: new FormControl(null),
      sponsorID: new FormControl(null, [
        Validators.minLength(20),
        Validators.maxLength(20),
      ]),
      unifiedNo: new FormControl(null),
      vatNo: new FormControl(null, Validators.required),
      capital: new FormControl(null),
      premium: new FormControl(null, Validators.required),

      // National Address
      buildingNo: new FormControl(null),
      streetName: new FormControl(null),
      secondryNo: new FormControl(null),
      districtName: new FormControl(null),
      postalCode: new FormControl(null),
      cityName: new FormControl(null, Validators.required),

      // Contact Details
      tele: new FormControl(null, [
        Validators.required,
        Validators.pattern("[0-9]{9}"),
      ]),
      tele2: new FormControl(null, [Validators.pattern("[0-9]{9}")]),
      fax: new FormControl(null),
      email: new FormControl(null, Validators.email),
      website: new FormControl(null),

      clientsBankAccounts: new FormArray<FormGroup<IClientsBankAccount>>([]),
      clientContacts: new FormArray<FormGroup<IClientContact>>([]),
    });
  }
  //#endregion

  //#region Client Details
  clientTypeToggler(e: any): void {
    switch (e) {
      case this.uiState.clientDetails.clientType.Corporate:
        this.uiState.clientDetails.corporate = false;
        this.uiState.clientDetails.retail = true;
        this.corporateClientType();
        break;
      case this.uiState.clientDetails.clientType.Retail:
        this.uiState.clientDetails.corporate = true;
        this.uiState.clientDetails.retail = false;
        this.retailClientType();
        break;
      default:
        this.uiState.clientDetails.corporate = true;
        this.uiState.clientDetails.retail = true;
        break;
    }
  }

  retailClientType(): void {
    // Retail Type
    this.f.idNo?.setValidators(Validators.required);
    this.f.expiryDate?.setValidators(Validators.required);
    this.f.nationality?.setValidators(Validators.required);
    this.f.sourceofIncome?.setValidators(Validators.required);

    // Corporate Type
    this.f.registrationStatus?.clearValidators();
    this.f.businessActivity?.clearValidators();
    this.f.marketSegment?.clearValidators();
    this.f.commericalNo?.clearValidators();
    this.f.dateOfIncorporation?.clearValidators();
    this.f.idExpiryDate?.clearValidators();
    this.f.vatNo?.clearValidators();
    this.f.premium?.clearValidators();

    this.formGroup.updateValueAndValidity();
  }

  corporateClientType(): void {
    // Retail Type
    this.f.idNo?.clearValidators();
    this.f.expiryDate?.clearValidators();
    this.f.nationality?.clearValidators();
    this.f.sourceofIncome?.clearValidators();

    // Corporate Type
    this.f.registrationStatus?.setValidators(Validators.required);
    this.f.businessActivity?.setValidators(Validators.required);
    this.f.marketSegment?.setValidators(Validators.required);
    this.f.commericalNo?.setValidators(Validators.required);
    this.f.dateOfIncorporation?.setValidators(Validators.required);
    this.f.idExpiryDate?.setValidators(Validators.required);
    this.f.vatNo?.setValidators(Validators.required);
    this.f.premium?.setValidators(Validators.required);

    this.formGroup.updateValueAndValidity();
  }

  //#endregion

  get f() {
    return this.formGroup.controls;
  }

  get bankControlArray(): FormArray {
    return this.formGroup.get("clientsBankAccounts") as FormArray;
  }

  get contactControlArray(): FormArray {
    return this.formGroup.get("clientContacts") as FormArray;
  }

  bankControls(i: number, control: string): AbstractControl {
    return this.bankControlArray.controls[i].get(control)!;
  }

  contactControls(i: number, control: string): AbstractControl {
    return this.contactControlArray.controls[i].get(control)!;
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

  addContact() {
    if (this.f.clientContacts?.invalid) {
      this.f.clientContacts?.markAllAsTouched();
      return;
    }
    let contact = new FormGroup<IClientContact>({
      contactName: new FormControl(null, Validators.required),
      position: new FormControl(null),
      extension: new FormControl(null),
      mobile: new FormControl(null, Validators.pattern("[0-9]{9}")),
      tele: new FormControl(null, Validators.pattern("[0-9]{9}")),
      email: new FormControl(null, [Validators.required, Validators.email]),
      clientID: new FormControl(null),
      branch: new FormControl(null),
      lineOfBusiness: new FormControl(null),
      department: new FormControl(null),
    });
    contact.reset();
    this.f.clientContacts?.push(contact);
    this.contactControlArray.updateValueAndValidity();
  }

  remove(i: number, type: string) {
    if (type === "bank") this.bankControlArray.removeAt(i);
    else if (type === "contact") this.contactControlArray.removeAt(i);
    else return;
  }

  onSubmit(clientForm: FormGroup<IClientForms>) {
    this.submitted = true;
    if (!clientForm) {
      return;
    }
    console.log(clientForm.value);
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
