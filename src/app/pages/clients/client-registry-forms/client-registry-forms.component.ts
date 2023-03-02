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
import {
  IClientCorporateForm,
  IClientForms,
  IClientRetailForm,
} from "src/app/shared/app/models/Clients/iclientForms";
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
      retail: new FormGroup<IClientRetailForm>({
        idNo: new FormControl("", Validators.required),
        nationality: new FormControl("", Validators.required),
        sourceofIncome: new FormControl("", Validators.required),
        idExpiryDate: new FormControl(null, Validators.required),
      }),

      // Corporate Type
      corporate: new FormGroup<IClientCorporateForm>({
        registrationStatus: new FormControl("", Validators.required),
        businessActivity: new FormControl("", Validators.required),
        marketSegment: new FormControl("", Validators.required),
        commericalNo: new FormControl("", Validators.required),
        dateOfIncorporation: new FormControl(null, Validators.required),
        dateOfIncorporationHijri: new FormControl(null),
        expiryDate: new FormControl(null, Validators.required),
        expiryDateHijri: new FormControl(null),
        sponsorID: new FormControl(null, [
          Validators.minLength(20),
          Validators.maxLength(20),
        ]),
        unifiedNo: new FormControl(""),
        vatNo: new FormControl(null, [
          Validators.minLength(15),
          Validators.maxLength(15),
          Validators.required,
        ]),
        capital: new FormControl(""),
        premium: new FormControl("", Validators.required),
      }),

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
    this.f.retail?.enable();

    // Corporate Type
    this.f.corporate?.disable();
  }

  corporateClientType(): void {
    // Retail Type
    this.f.retail?.disable();

    // Corporate Type
    this.f.corporate?.enable();
  }
  //#endregion

  //#region Form Controls
  get f(): IClientForms {
    return this.formGroup.controls;
  }

  get retail(): IClientRetailForm {
    return this.f.retail?.controls!;
  }

  get corporate(): IClientCorporateForm {
    return this.f.corporate?.controls!;
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
    console.log(this.corporate.vatNo?.errors?.["minLength"]);
    console.log(this.corporate.vatNo?.errors);

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
      retail: {
        idNo: client.idNo,
        nationality: client.nationality,
        sourceofIncome: client.sourceofIncome,
        idExpiryDate: this.util.dateStructFormat(client.idExpiryDate!) as any,
      },
      corporate: {
        registrationStatus: client.registrationStatus,
        businessActivity: client.businessActivity,
        marketSegment: client.marketSegment,
        commericalNo: client.commericalNo,
        sponsorID: client.sponsorID,
        unifiedNo: client.unifiedNo,
        vatNo: client.vatNo,
        capital: client.capital,
        premium: client.premium,
        // Date Of Incorporation
        dateOfIncorporation: this.util.dateStructFormat(
          client.dateOfIncorporation!
        ) as any,
        dateOfIncorporationHijri: this.util.dateStructFormat(
          client.dateOfIncorporationHijri!
        ) as any,

        // Expiry Date
        expiryDate: this.util.dateStructFormat(client.expiryDate!) as any,
        expiryDateHijri: this.util.dateStructFormat(
          client.expiryDateHijri!
        ) as any,
      },
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
    let val = clientForm.getRawValue();
    const formData = new FormData();

    if (this.uiState.editId) formData.append("sNo", this.uiState.editId);

    formData.append("FullName", val.fullName!);
    formData.append("FullNameAr", val.fullNameAr!);
    formData.append("OfficalName", val.officalName!);
    formData.append("RelationshipStatus", val.relationshipStatus!);
    formData.append("BusinessType", val.businessType!);
    formData.append("Type", val.type!);

    // Retail
    formData.append("IDNo", val.retail?.idNo ?? "");
    formData.append(
      "IDExpiryDate",
      this.util.dateFormater(val.retail?.idExpiryDate ?? "")
    );
    formData.append("Nationality", val.retail?.nationality ?? "");
    formData.append("SourceofIncome", val.retail?.sourceofIncome ?? "");

    // Corporate
    formData.append(
      "RegistrationStatus",
      val.corporate?.registrationStatus ?? ""
    );
    formData.append("BusinessActivity", val.corporate?.businessActivity ?? "");
    formData.append("MarketSegment", val.corporate?.marketSegment ?? "");
    formData.append(
      "DateOfIncorporation",
      this.util.dateFormater(val.corporate?.dateOfIncorporation ?? "")
    );
    formData.append(
      "DateOfIncorporationHijri",
      this.util.dateFormater(val.corporate?.dateOfIncorporationHijri ?? "")
    );
    formData.append("CommericalNo", val.corporate?.commericalNo ?? "");
    formData.append(
      "ExpiryDate",
      this.util.dateFormater(val.corporate?.expiryDate ?? "")
    );
    formData.append(
      "ExpiryDateHijri",
      this.util.dateFormater(val.corporate?.expiryDateHijri ?? "")
    );
    formData.append("SponsorID", val.corporate?.sponsorID ?? "");
    formData.append("UnifiedNo", val.corporate?.unifiedNo ?? "");
    formData.append("VATNo", val.corporate?.vatNo ?? "");
    formData.append("Capital", val.corporate?.capital ?? "");
    formData.append("Premium", val.corporate?.premium ?? "");
    formData.append("BuildingNo", val.buildingNo!);
    formData.append("Tele", val.tele!);
    formData.append("Tele2", val.tele2!);
    formData.append("Fax", val.fax!);
    formData.append("Channel", val.channel!);
    formData.append("Interface", val.interface!);
    formData.append("Producer", val.producer!);
    formData.append("ScreeningResult", val.screeningResult!);
    formData.append("Branch", val.branch!);
    formData.append("StreetName", val.streetName!);
    formData.append("SecondryNo", val.secondryNo!);
    formData.append("DistrictName", val.districtName!);
    formData.append("PostalCode", val.postalCode!);
    formData.append("CityName", val.cityName!);
    formData.append("Email", val.email!);
    formData.append("Website", val.website!);

    this.contactControlArray.controls.forEach((el) => el.enable());

    let contacts = val.clientContacts!;

    for (let i = 0; i < contacts.length; i++) {
      formData.append(
        `ClientContacts[${i}].contactName`,
        contacts[i].contactName!
      );
      formData.append(`ClientContacts[${i}].mobile`, contacts[i].mobile ?? "");
      formData.append(
        `ClientContacts[${i}].lineOfBusiness`,
        contacts[i].lineOfBusiness ?? ""
      );
      formData.append(
        `ClientContacts[${i}].department`,
        contacts[i].department ?? ""
      );
      formData.append(
        `ClientContacts[${i}].extension`,
        contacts[i].extension ?? ""
      );
      formData.append(
        `ClientContacts[${i}].position`,
        contacts[i].position ?? ""
      );
      formData.append(`ClientContacts[${i}].tele`, contacts[i].tele ?? "");
      formData.append(`ClientContacts[${i}].email`, contacts[i].email!);
      formData.append(`ClientContacts[${i}].branch`, contacts[i].branch ?? "");
    }

    this.bankControlArray.controls.forEach((el) => el.enable());

    let banks = val.clientsBankAccounts!;

    for (let i = 0; i < banks.length; i++) {
      formData.append(`ClientsBankAccounts[${i}].bankName`, banks[i].bankName!);
      formData.append(
        `ClientsBankAccounts[${i}].arabicName`,
        banks[i].arabicName ?? ""
      );
      formData.append(
        `ClientsBankAccounts[${i}].branch`,
        banks[i].branch ?? ""
      );
      formData.append(`ClientsBankAccounts[${i}].fullName`, banks[i].fullName!);
      formData.append(`ClientsBankAccounts[${i}].iban`, banks[i].iban ?? "");
      formData.append(
        `ClientsBankAccounts[${i}].swiftCode`,
        banks[i].swiftCode ?? ""
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
      (err) => {
        this.message.popup("Sorry!", err.message!, "error");
        this.eventService.broadcast(reserved.isLoading, false);
      }
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
    this.retail.idExpiryDate?.patchValue(e.gon);
  }

  coIncorporationDates(e: { gon: any; hijri: any }): void {
    this.corporate.dateOfIncorporationHijri?.patchValue(e.hijri);
    this.corporate.dateOfIncorporation?.patchValue(e.gon);
  }

  coExpiryDates(e: { gon: any; hijri: any }): void {
    this.corporate.expiryDateHijri?.patchValue(e.hijri);
    this.corporate.expiryDate?.patchValue(e.gon);
  }
  //#endregion

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
