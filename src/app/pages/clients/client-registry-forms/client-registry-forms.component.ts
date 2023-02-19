import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessagesService } from "src/app/shared/services/messages.service";
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
import { Observable, Subscription } from "rxjs";
import { IClientContact } from "src/app/shared/app/models/Clients/iclientContactForm";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { ClientsService } from "src/app/shared/services/clients/clients.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IClientPreview } from "src/app/shared/app/models/Clients/iclient-preview";
import { HttpResponse } from "@angular/common/http";
import AppUtils from "src/app/shared/app/util";
import { EventService } from "src/app/core/services/event.service";
import { reserved } from "src/app/core/models/reservedWord";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

@Component({
  selector: "app-client-registry-forms",
  templateUrl: "./client-registry-forms.component.html",
  styleUrls: ["./client-registry-forms.component.scss"],
})
export class ClientRegistryFormsComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup<IClientForms>;
  submitted: boolean = false;
  formData!: Observable<IBaseMasterTable>;

  uiState = {
    editMode: false,
    editId: "",
    clientDetails: {
      clientType: ClientType,
      retail: true,
      corporate: true,
    },
  };

  documentsToUpload: File[] = [];
  docs: any[] = [];

  @ViewChild("dropzone") dropzone!: any;
  subscribes: Subscription[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private message: MessagesService,
    private tables: MasterTableService,
    private clientService: ClientsService,
    private util: AppUtils,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.formData = this.tables.getBaseData(MODULES.ClientForm);

    let sub = this.route.paramMap.subscribe((res) => {
      if (res.get("id")) {
        this.uiState.editId = res.get("id")!;
        // Display Loader
        this.eventService.broadcast(reserved.isLoading, true);
        this.getClient(this.uiState.editId);
      }
    });
    this.subscribes.push(sub);
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
      nationality: new FormControl("", Validators.required),
      sourceofIncome: new FormControl("", Validators.required),
      idExpiryDate: new FormControl(null, Validators.required),

      // Corporate Type
      registrationStatus: new FormControl("", Validators.required),
      businessActivity: new FormControl("", Validators.required),
      marketSegment: new FormControl("", Validators.required),
      commericalNo: new FormControl("", Validators.required),
      dateOfIncorporation: new FormControl(null, Validators.required),
      dateOfIncorporationHijri: new FormControl(null),
      expiryDate: new FormControl(null, Validators.required),
      expiryDateHijri: new FormControl(null),
      sponsorID: new FormControl("", [
        Validators.minLength(20),
        Validators.maxLength(20),
      ]),
      unifiedNo: new FormControl(""),
      vatNo: new FormControl("", Validators.required),
      capital: new FormControl(""),
      premium: new FormControl("", Validators.required),

      // National Address
      buildingNo: new FormControl(""),
      streetName: new FormControl(""),
      secondryNo: new FormControl(""),
      districtName: new FormControl(""),
      postalCode: new FormControl(""),
      cityName: new FormControl("", Validators.required),

      // Contact Details
      tele: new FormControl("", [
        Validators.required,
        Validators.pattern("[0-9]{9}"),
      ]),
      tele2: new FormControl("", [Validators.pattern("[0-9]{9}")]),
      fax: new FormControl(""),
      email: new FormControl("", Validators.email),
      website: new FormControl(""),

      clientsBankAccounts: new FormArray<FormGroup<IClientsBankAccount>>([]),
      clientContacts: new FormArray<FormGroup<IClientContact>>([]),
    });
  }
  //#endregion

  //#region Client Details
  clientTypeToggler(e: string): void {
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
    let retailControls = [
      this.f.idNo!,
      this.f.nationality!,
      this.f.sourceofIncome!,
      this.f.idExpiryDate!,
    ];
    this.setValidatorAndUpdate(retailControls);

    // Corporate Type
    let coporateControls = [
      this.f.registrationStatus!,
      this.f.businessActivity!,
      this.f.marketSegment!,
      this.f.commericalNo!,
      this.f.dateOfIncorporation!,
      this.f.vatNo!,
      this.f.premium!,
      this.f.expiryDate!,
    ];
    this.removeValidatorAndUpdate(coporateControls);
  }

  corporateClientType(): void {
    // Retail Type
    let retailControls = [
      this.f.idNo!,
      this.f.nationality!,
      this.f.sourceofIncome!,
      this.f.idExpiryDate!,
    ];
    this.removeValidatorAndUpdate(retailControls);

    // Corporate Type
    let coporateControls = [
      this.f.registrationStatus!,
      this.f.businessActivity!,
      this.f.marketSegment!,
      this.f.commericalNo!,
      this.f.dateOfIncorporation!,
      this.f.vatNo!,
      this.f.premium!,
      this.f.expiryDate!,
    ];
    this.setValidatorAndUpdate(coporateControls);
  }

  setValidatorAndUpdate(controls: FormControl[]) {
    controls.map((el) => {
      el.setValidators(Validators.required);
      el.updateValueAndValidity();
    });
  }

  removeValidatorAndUpdate(controls: FormControl[]) {
    controls.map((el) => {
      el.clearValidators();
      el.updateValueAndValidity();
    });
  }

  //#endregion

  //#region Form Controls
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

  addBank(data?: IClientsBankAccount) {
    if (this.f.clientsBankAccounts?.invalid) {
      this.f.clientsBankAccounts?.markAllAsTouched();
      return;
    }
    let bank = new FormGroup<IClientsBankAccount>({
      arabicName: new FormControl(data?.arabicName || null),
      clientID: new FormControl(data?.clientID || null),
      bankName: new FormControl(data?.bankName || null, Validators.required),
      branch: new FormControl(data?.branch || null),
      iban: new FormControl(data?.iban || null),
      swiftCode: new FormControl(data?.swiftCode || null),
      fullName: new FormControl(data?.fullName || null, Validators.required),
      stauts: new FormControl(data?.stauts || null),
    });

    if (!data) bank.reset();
    else bank.disable();

    this.f.clientsBankAccounts?.push(bank);
    this.bankControlArray.updateValueAndValidity();
  }

  addContact(data?: IClientContact): void {
    if (this.f.clientContacts?.invalid) {
      this.f.clientContacts?.markAllAsTouched();
      return;
    }
    let contact = new FormGroup<IClientContact>({
      contactName: new FormControl(
        data?.contactName || null,
        Validators.required
      ),
      position: new FormControl(data?.position || null),
      extension: new FormControl(data?.extension || null),
      mobile: new FormControl(
        data?.mobile || null,
        Validators.pattern("[0-9]{9}")
      ),
      tele: new FormControl(data?.tele || null, Validators.pattern("[0-9]{9}")),
      email: new FormControl(data?.email || null, [
        Validators.required,
        Validators.email,
      ]),
      clientID: new FormControl(data?.clientID || null),
      branch: new FormControl(data?.branch || null),
      lineOfBusiness: new FormControl(data?.lineOfBusiness || null),
      department: new FormControl(data?.department || null),
    });

    if (!data) contact.reset();
    else contact.disable();

    this.f.clientContacts?.push(contact);
    this.contactControlArray.updateValueAndValidity();
  }

  remove(i: number, type: string) {
    if (type === "bank") this.bankControlArray.removeAt(i);
    else if (type === "contact") this.contactControlArray.removeAt(i);
    else return;
  }

  enableEditingRow(i: number, type: string) {
    if (type === "bank") this.bankControlArray.at(i).enable();
    else if (type === "contact") this.contactControlArray.at(i).enable();
    else return;
  }
  //#endregion

  documentsList(evt: File[]) {
    this.documentsToUpload = evt;
  }

  getClient(id: string): void {
    this.uiState.editMode = true;
    let sub = this.clientService.getClientById(id).subscribe(
      (res: HttpResponse<IBaseResponse<IClientPreview>>) => {
        if (res.body?.status) {
          this.patchEditingClient(res.body?.data!);
        }
      },
      (err) => {
        this.eventService.broadcast(reserved.isLoading, false);
        this.message.popup("Error", err.message, "error");
      }
    );
    this.subscribes.push(sub);
  }

  patchEditingClient(client: IClientPreview): void {
    this.clientTypeToggler(client.type!);
    this.uiState.editId = client.sNo?.toString()!;
    this.formGroup.patchValue({
      sNo: client.sNo,
      type: client.type,
      fullName: client.fullName,
      fullNameAr: client.fullNameAr,
      producer: client.producer,
      relationshipStatus: client.relationshipStatus,
      businessType: client.businessType,
      channel: client.channel,
      interface: client.interface,
      screeningResult: client.screeningResult,
      officalName: client.officalName,
      idNo: client.idNo,
      nationality: client.nationality,
      sourceofIncome: client.sourceofIncome,
      registrationStatus: client.registrationStatus,
      businessActivity: client.businessActivity,
      marketSegment: client.marketSegment,
      commericalNo: client.commericalNo,
      sponsorID: client.sponsorID,
      unifiedNo: client.unifiedNo,
      vatNo: client.vatNo,
      capital: client.capital,
      premium: client.premium,
      buildingNo: client.buildingNo,
      streetName: client.streetName,
      secondryNo: client.secondryNo,
      districtName: client.districtName,
      postalCode: client.postalCode,
      cityName: client.cityName,
      tele: client.tele,
      tele2: client.tele2,
      fax: client.fax,
      email: client.email,
      website: client.website,
    });

    // @@@@@@ Dates Formating To Append Values @@@@@@ //
    // Date Of Incorporation
    this.f.dateOfIncorporation?.patchValue(
      this.util.dateStructFormat(client.dateOfIncorporation!) as any
    );

    // Date Of Incorporation Hijri
    this.f.dateOfIncorporationHijri?.patchValue(
      this.util.dateStructFormat(client.dateOfIncorporationHijri!) as any
    );

    // Expiry Date
    this.f.expiryDate?.patchValue(
      this.util.dateStructFormat(client.expiryDate!) as any
    );

    // Expiry Date Hijri
    this.f.expiryDateHijri?.patchValue(
      this.util.dateStructFormat(client.expiryDateHijri!) as any
    );

    // Retail ID Expiry Date
    this.f.idExpiryDate?.patchValue(
      this.util.dateStructFormat(client.idExpiryDate!) as any
    );

    this.docs = client.documentList!;

    client.clientContacts?.map((con) => this.addContact(con));
    client.clientsBankAccounts?.map((bank) => this.addBank(bank));

    // Hide Loader
    this.eventService.broadcast(reserved.isLoading, false);
  }

  onSubmit(clientForm: FormGroup<IClientForms>) {
    this.submitted = true;
    if (!this.validationChecker()) return;

    // Display Submitting Loader
    this.eventService.broadcast(reserved.isLoading, true);

    const formData = new FormData();

    if (this.uiState.editId) formData.append("sNo", this.uiState.editId);

    formData.append("FullName", clientForm.value.fullName!);
    formData.append("FullNameAr", clientForm.value.fullNameAr!);
    formData.append("OfficalName", clientForm.value.officalName!);
    formData.append("RelationshipStatus", clientForm.value.relationshipStatus!);
    formData.append("BusinessType", clientForm.value.businessType!);
    formData.append("Type", clientForm.value.type!);
    formData.append("IDNo", clientForm.value.idNo!);
    formData.append(
      "IDExpiryDate",
      this.util.dateFormater(clientForm.value.idExpiryDate!)
    );
    formData.append("Nationality", clientForm.value.nationality!);
    formData.append("SourceofIncome", clientForm.value.sourceofIncome!);
    formData.append("RegistrationStatus", clientForm.value.registrationStatus!);
    formData.append("BusinessActivity", clientForm.value.businessActivity!);
    formData.append("MarketSegment", clientForm.value.marketSegment!);
    formData.append(
      "DateOfIncorporation",
      this.util.dateFormater(clientForm.value.dateOfIncorporation!)
    );
    formData.append(
      "DateOfIncorporationHijri",
      this.util.dateFormater(clientForm.value.dateOfIncorporationHijri!)
    );
    formData.append("CommericalNo", clientForm.value.commericalNo!);
    formData.append(
      "ExpiryDate",
      this.util.dateFormater(clientForm.value.expiryDate!)
    );
    formData.append(
      "ExpiryDateHijri",
      this.util.dateFormater(clientForm.value.expiryDateHijri!)
    );
    formData.append("SponsorID", clientForm.value.sponsorID!);
    formData.append("UnifiedNo", clientForm.value.unifiedNo!);
    formData.append("VATNo", clientForm.value.vatNo!);
    formData.append("Capital", clientForm.value.capital!);
    formData.append("Premium", clientForm.value.premium!);
    formData.append("BuildingNo", clientForm.value.buildingNo!);
    formData.append("Tele", clientForm.value.tele!);
    formData.append("Tele2", clientForm.value.tele2!);
    formData.append("Fax", clientForm.value.fax!);
    formData.append("Channel", clientForm.value.channel!);
    formData.append("Interface", clientForm.value.interface!);
    formData.append("Producer", clientForm.value.producer!);
    formData.append("ScreeningResult", clientForm.value.screeningResult!);
    formData.append("Branch", clientForm.value.branch!);
    formData.append("StreetName", clientForm.value.streetName!);
    formData.append("SecondryNo", clientForm.value.secondryNo!);
    formData.append("DistrictName", clientForm.value.districtName!);
    formData.append("PostalCode", clientForm.value.postalCode!);
    formData.append("CityName", clientForm.value.cityName!);
    formData.append("Email", clientForm.value.email!);
    formData.append("Website", clientForm.value.website!);

    this.contactControlArray.controls.forEach((el) => el.enable());

    let contacts = clientForm.value.clientContacts!;

    for (let i = 0; i < contacts.length; i++) {
      formData.append(
        `ClientContacts[${i}].contactName`,
        contacts[i].contactName!
      );
      formData.append(`ClientContacts[${i}].mobile`, contacts[i].mobile!);
      formData.append(
        `ClientContacts[${i}].lineOfBusiness`,
        contacts[i].lineOfBusiness!
      );
      formData.append(
        `ClientContacts[${i}].department`,
        contacts[i].department!
      );
      formData.append(`ClientContacts[${i}].extension`, contacts[i].extension!);
      formData.append(`ClientContacts[${i}].position`, contacts[i].position!);
      formData.append(`ClientContacts[${i}].tele`, contacts[i].tele!);
      formData.append(`ClientContacts[${i}].email`, contacts[i].email!);
      formData.append(`ClientContacts[${i}].address`, contacts[i].address!);
    }

    this.bankControlArray.controls.forEach((el) => el.enable());

    let banks = clientForm.value.clientsBankAccounts!;

    for (let i = 0; i < banks.length; i++) {
      formData.append(`ClientsBankAccounts[${i}].bankName`, banks[i].bankName!);
      formData.append(
        `ClientsBankAccounts[${i}].arabicName`,
        banks[i].arabicName!
      );
      formData.append(`ClientsBankAccounts[${i}].branch`, banks[i].branch!);
      formData.append(`ClientsBankAccounts[${i}].fullName`, banks[i].fullName!);
      formData.append(`ClientsBankAccounts[${i}].iban`, banks[i].iban!);
      formData.append(
        `ClientsBankAccounts[${i}].swiftCode`,
        banks[i].swiftCode!
      );
    }

    this.documentsToUpload.forEach((el) => formData.append("Documents", el));

    // this.validationChecker();

    let sub = this.clientService.saveClient(formData).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.message.toast(res.body.message!, "success");
          if (this.uiState.editId)
            this.router.navigate([AppRoutes.Client.base]);
          this.resetForm();
        } else this.message.popup("Sorry!", res.body?.message!, "warning");
        // Hide Loader
        this.eventService.broadcast(reserved.isLoading, false);
      },
      (err) => this.message.popup("Sorry!", err.message!, "error")
    );
    this.subscribes.push(sub);
  }

  validationChecker(): boolean {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if (this.formGroup.invalid) return false;
    return true;
  }

  resetForm(): void {
    this.formGroup.reset();
    this.clientTypeToggler("");
    this.f.clientsBankAccounts?.clear();
    this.f.clientContacts?.clear();
    this.submitted = false;
  }

  // @@@@ Date Events @@@@ //
  //#region Dates
  retailExpiryDate(e: { gon: any; hijri: any }): void {
    this.f.idExpiryDate?.patchValue(e.gon);
  }

  coIncorporationDates(e: { gon: any; hijri: any }): void {
    this.f.dateOfIncorporationHijri?.patchValue(e.hijri);
    this.f.dateOfIncorporation?.patchValue(e.gon);
  }

  coExpiryDates(e: { gon: any; hijri: any }): void {
    this.f.expiryDateHijri?.patchValue(e.hijri);
    this.f.expiryDate?.patchValue(e.gon);
  }
  //#endregion

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
