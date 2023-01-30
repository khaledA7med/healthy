import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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

@Component({
  selector: "app-client-registry-forms",
  templateUrl: "./client-registry-forms.component.html",
  styleUrls: ["./client-registry-forms.component.scss"],
})
export class ClientRegistryFormsComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup<IClientForms>;
  submitted = false;
  formData!: Observable<IBaseMasterTable>;

  editId!: string;

  uiState = {
    formMode: false,
    clientDetails: {
      clientType: ClientType,
      retail: true,
      corporate: true,
    },
  };

  documentsToUpload: any[] = [];
  documentsToDisplay: any[] = [];
  // Testing Dates New Models
  incorporationGregorianDate?: any;
  incorporationHijriDate?: any;
  CRExpiryGregorianDate?: any;
  CRExpiryHijriDate?: any;
  
  // -------------------

  @ViewChild("dropzone") dropzone!: any;

  subscribes: Subscription[] = [];
  constructor(
    private route: ActivatedRoute,
    private message: MessagesService,
    private tables: MasterTableService,
    private clientService: ClientsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.formData = this.tables.getBaseData(MODULES.ClientForm);

    let sub = this.route.paramMap.subscribe((res) => {
      if (res.get("id")) {
        this.editId = res.get("id")!;
        this.getClient(this.editId);
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

  documentsList(evt: any) {
    console.log(evt);
  }

  getClient(id: string): void {
    this.uiState.formMode = true;
    let sub = this.clientService.getClientById(id).subscribe(
      (res: HttpResponse<IBaseResponse<IClientPreview>>) => {
        if (res.body?.status) {
          this.patchEditingClient(res.body?.data!);
        }
      },
      (err) => this.message.popup("Error", err.message, "error")
    );
    this.subscribes.push(sub);
  }

  patchEditingClient(client: IClientPreview): void {
    this.clientTypeToggler(client.type!);
    this.formGroup.patchValue({
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
      expiryDate: client.expiryDate,
      nationality: client.nationality,
      sourceofIncome: client.sourceofIncome,
      registrationStatus: client.registrationStatus,
      businessActivity: client.businessActivity,
      marketSegment: client.marketSegment,
      commericalNo: client.commericalNo,
      dateOfIncorporation: client.dateOfIncorporation,
      dateOfIncorporationHijri: client.dateOfIncorporationHijri!,
      idExpiryDate: client.idExpiryDate,
      expiryDateHijri: client.expiryDateHijri,
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

    client.clientContacts?.map((con) => this.addContact(con));
    client.clientsBankAccounts?.map((bank) => this.addBank(bank));
  }

  onSubmit(clientForm: FormGroup<IClientForms>) {
    this.submitted = true;
    const formData = new FormData();

    // SNo;

    // formData.append('Status', clientForm.value.status)

    // PolicyType;

    // formData.append('FullName', clientForm.value.fullName!)
    // formData.append('FullNameAr', clientForm.value.fullNameAr!)
    // formData.append('OfficalName', clientForm.value.officalName!)
    // formData.append('RelationshipStatus', clientForm.value.relationshipStatus!)
    // formData.append('BusinessType', clientForm.value.businessType!)
    // formData.append('Type', clientForm.value.type!)
    // formData.append('IDNo', clientForm.value.idNo!)
    // formData.append('IDExpiryDate', clientForm.value.idExpiryDate!)
    // formData.append('OfficalName', clientForm.value.officalName!)
    // formData.append('OfficalName', clientForm.value.officalName!)
    // formData.append('OfficalName', clientForm.value.officalName!)

    // ;

    // Nationality;

    // SourceofIncome;

    // RegistrationStatus;

    // BusinessActivity;

    // MarketSegment;

    // DateOfIncorporation;

    // DateOfIncorporationHijri;

    // CommericalNo;

    // ExpiryDate;

    // ExpiryDateHijri;

    // SponsorID;

    // UnifiedNo;

    // VATNo;

    // Capital;

    // Location;

    // Premium;

    // BuildingNo;

    // POBox;

    // Tele;

    // Tele2;

    // Fax;

    // Channel;

    // Interface;

    // Producer;

    // ScreeningResult;

    // Branch;

    // CreatedBy;

    // StreetName;

    // SecondryNo;

    // DistrictName;

    // PostalCode;

    // CityName;

    // Email;

    // Website;

    // UpdatedBy;

    // ClientContacts;
    // ClientsBankAccounts;
    // Documents;

    // this.validationChecker();
    console.log(clientForm.value);
    let test: IClientPreview = {
      screeningResult: clientForm.value.screeningResult!,
    };
    let test2: IClientPreview = clientForm.value! as IClientPreview;
    this.clientService.saveClient(test2).subscribe((res) => {
      console.log(res);
    });
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
  setIncorporationHijriDate(e: any) {
    this.incorporationHijriDate = e;
  }
  setIncorporationGregorianDate(e: any) {
    this.incorporationGregorianDate = e;
  }
  seCRExpirytHijriDate(e: any) {
    this.CRExpiryHijriDate = e;
  }
  setCRExpiryGregorianDate(e: any) {
    this.CRExpiryGregorianDate = e;
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
