import { HttpResponse } from "@angular/common/http";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { MODULES } from "src/app/core/models/MODULES";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import {
  IContactList,
  IContactListData,
} from "src/app/shared/app/models/MasterTables/claims/hospitals/i-contact-list";
import {
  IHospitals,
  IHospitalsData,
} from "src/app/shared/app/models/MasterTables/claims/hospitals/i-hospitals";
import { IHospitalsPreview } from "src/app/shared/app/models/MasterTables/claims/hospitals/i-hospitals-preview";
import {
  INetworkList,
  INetworkListData,
} from "src/app/shared/app/models/MasterTables/claims/hospitals/i-network-list";
import { HospitalsService } from "src/app/shared/services/master-tables/claims/hospitals.service";
import { MessagesService } from "src/app/shared/services/messages.service";

@Component({
  selector: "app-hospital-forms",
  templateUrl: "./hospital-forms.component.html",
  styleUrls: ["./hospital-forms.component.scss"],
})
export class HospitalFormsComponent implements OnInit, OnDestroy {
  @Input() data!: {
    sno: number;
  };

  lookupData!: Observable<IBaseMasterTable>;
  subscribes: Subscription[] = [];
  HospitalsFormSubmitted = false as boolean;
  HospitalsModal!: NgbModalRef;
  HospitalsForm!: FormGroup<IHospitals>;

  uiState = {
    isLoading: false as boolean,
    submitted: false,
    list: [] as IHospitals[],
    editHospitalsMode: false as Boolean,
    editHospitalsData: {} as IHospitalsData,
  };

  constructor(
    private message: MessagesService,
    private HospitalsService: HospitalsService,
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private table: MasterTableService
  ) {}

  ngOnInit(): void {
    this.initHospitalsForm();
    this.getLookupData();
    this.getHospitalData(this.data.sno);
  }

  getLookupData() {
    this.lookupData = this.table.getBaseData(MODULES.Hospitals);
  }

  getHospitalData(sno: number) {
    if (sno) {
      let sub = this.HospitalsService.getEditHospitalsData(sno).subscribe(
        (res: HttpResponse<IBaseResponse<IHospitalsPreview>>) => {
          if (res.body?.status) {
            this.uiState.editHospitalsMode = true;
            this.fillEditHospitalsForm(res.body?.data!);
          } else this.message.toast(res.body!.message!, "error");
        }
      );
      this.subscribes.push(sub);
    }
  }

  initHospitalsForm() {
    this.HospitalsForm = new FormGroup<IHospitals>({
      sno: new FormControl(null),
      name: new FormControl("", Validators.required),
      city: new FormControl(""),
      tele: new FormControl(""),
      email: new FormControl("", Validators.email),
      fax: new FormControl(""),
      address: new FormControl(""),
      specialties: new FormControl(""),
      region: new FormControl(""),
      contactList: new FormArray<FormGroup<IContactList>>([]),
      networkList: new FormArray<FormGroup<INetworkList>>([]),
    });
  }

  get f() {
    return this.HospitalsForm.controls;
  }

  //#network List Array
  get networkListArray(): FormArray {
    return this.HospitalsForm.get("networkList") as FormArray;
  }

  //get network List Controls
  networkListControls(i: number, control: string): AbstractControl {
    return this.networkListArray.controls[i].get(control)!;
  }
  //#contact List Array
  get contactListArray(): FormArray {
    return this.HospitalsForm.get("contactList") as FormArray;
  }
  //get contact List Controls
  contactListControls(i: number, control: string): AbstractControl {
    return this.contactListArray.controls[i].get(control)!;
  }
  addNetwork(data?: INetworkListData): void {
    if (this.f.networkList?.invalid) {
      this.f.networkList?.markAllAsTouched();
      return;
    }
    let network = new FormGroup<INetworkList>({
      sNo: new FormControl(data?.sNo || null),
      insurCompany: new FormControl(data?.insurCompany || null),
      hospitalId: new FormControl(data?.hospitalId || null),
      hospitalName: new FormControl(data?.hospitalName || null),
      savedUser: new FormControl(data?.savedUser || null),
      classA: new FormControl(data?.classA || null),
      classAm: new FormControl(data?.classAm || null),
      classAp: new FormControl(data?.classAp || null),
      classB: new FormControl(data?.classB || null),
      classBm: new FormControl(data?.classBm || null),
      classBp: new FormControl(data?.classBp || null),
      classC: new FormControl(data?.classC || null),
      classCa: new FormControl(data?.classCa || null),
      classCae: new FormControl(data?.classCae || null),
      classCD: new FormControl(data?.classCD || null),
      classCm: new FormControl(data?.classCm || null),
      classCp: new FormControl(data?.classCp || null),
      classE: new FormControl(data?.classE || null),
      classVip: new FormControl(data?.classVip || null),
      classVvip: new FormControl(data?.classVvip || null),
    });

    if (!data) network.reset();
    else network.disable();

    this.f.networkList?.push(network);
    this.networkListArray.updateValueAndValidity();
  }

  addContact(data?: IContactListData) {
    if (this.f.contactList?.invalid) {
      this.f.contactList?.markAllAsTouched();
      return;
    }
    let contact = new FormGroup<IContactList>({
      sNo: new FormControl(data?.sNo || null),
      hospitalId: new FormControl(data?.hospitalId || null),
      savedUser: new FormControl(data?.savedUser || null),
      name: new FormControl(data?.name || null, Validators.required),
      position: new FormControl(data?.position || null, Validators.required),
      email: new FormControl(data?.email || null, [
        Validators.email,
        Validators.required,
      ]),
      phone: new FormControl(data?.phone || null, Validators.required),
    });

    if (!data) contact.reset();
    else contact.disable();

    this.f.contactList?.push(contact);
    this.contactListArray.updateValueAndValidity();
  }

  remove(i: number, type: string) {
    if (type === "network") this.networkListArray.removeAt(i);
    else if (type === "contact") this.contactListArray.removeAt(i);
    else return;
  }

  enableEditingRow(i: number, type: string) {
    if (type === "network") this.networkListArray.at(i).enable();
    else if (type === "contact") this.contactListArray.at(i).enable();
    else return;
  }
  //#endregion

  fillEditHospitalsForm(data: IHospitalsPreview): void {
    this.HospitalsForm.patchValue({
      sno: data.sno,
      name: data.name,
      city: data.city,
      tele: data.tele,
      email: data.email,
      address: data.address,
      fax: data.fax,
      specialties: data.specialties,
      region: data.region,
    });
    if (data?.networkList!) {
      data?.networkList!.forEach((el) => this.addNetwork(el));
    }
    if (data?.contactList!) {
      data?.contactList!.forEach((con) => this.addContact(con));
    }
    this.f.name?.disable();
    this.f.city?.disable();
    this.f.address?.disable();
    this.f.email?.disable();
    this.f.tele?.disable();
    this.f.fax?.disable();
    this.f.specialties?.disable();
    this.f.region?.disable();
  }

  validationChecker(): boolean {
    if (this.HospitalsForm.invalid) {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  submitHospitalsData(HospitalsForm: FormGroup<IHospitals>): void {
    this.uiState.submitted = true;
    if (!this.validationChecker()) return;

    let val = HospitalsForm.getRawValue();
    const formData = new FormData();

    if (this.uiState.editHospitalsMode)
      formData.append("sno", val.sno?.toString()! ?? 0);
    formData.append("name", val.name!);
    formData.append("city", val.city! ?? "");
    formData.append("address", val.address! ?? "");
    formData.append("email", val.email!);
    formData.append("tele", val.tele!);
    formData.append("fax", val.fax! ?? "");
    formData.append("specialties", val.specialties! ?? "");
    formData.append("region", val.region! ?? "");

    this.contactListArray.controls.forEach((el) => el.enable());
    let contact = val.contactList!;
    for (let i = 0; i < contact.length; i++) {
      formData.append(`contactList[${i}]`, contact[i].email! ?? "");
      formData.append(`contactList[${i}]`, contact[i].name! ?? "");
      formData.append(`contactList[${i}]`, contact[i].position! ?? "");
      formData.append(`contactList[${i}]`, contact[i].phone! ?? "");
    }

    this.networkListArray.controls.forEach((el) => el.enable());
    let network = val.networkList!;
    for (let i = 0; i < network.length; i++) {
      formData.append(`networkList[${i}]`, network[i].insurCompany! ?? "");
      formData.append(
        `networkList[${i}]`,
        network[i].classVvip?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].classVip?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].classA?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].classAm?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].classAp?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].classB?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].classBm?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].classBp?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].classC?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].classCD?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].classCa?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].classCae?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].classCm?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].classCp?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].classE?.toString()! ?? ""
      );
    }

    let sub = this.HospitalsService.saveHospitals(formData).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.message.toast(res.body?.message!, "success");
          this.modal.dismiss();
          this.backToMainRoute();
        } else this.message.popup("Sorry!", res.body?.message!, "warning");
      }
    );
    this.subscribes.push(sub);
  }
  // To Do back to main route when close modal
  backToMainRoute() {
    this.modalService.dismissAll();
  }

  resetHospitalsForm() {
    this.HospitalsForm.reset();
    this.contactListArray.clear();
    this.networkListArray.clear();
    this.f.name?.enable();
    this.f.city?.enable();
    this.f.address?.enable();
    this.f.email?.enable();
    this.f.tele?.enable();
    this.f.fax?.enable();
    this.f.specialties?.enable();
    this.f.region?.enable();
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
