import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import {
  CellEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { EventService } from "src/app/core/services/event.service";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { reserved } from "src/app/core/models/reservedWord";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { HospitalsService } from "src/app/shared/services/master-tables/claims/hospitals.service";
import { hospitalsCols } from "src/app/shared/app/grid/hospitalsCols";
import {
  IHospitals,
  IHospitalsData,
} from "src/app/shared/app/models/MasterTables/claims/hospitals/i-hospitals";
import {
  IContactList,
  IContactListData,
} from "src/app/shared/app/models/MasterTables/claims/hospitals/i-contact-list";
import {
  INetworkList,
  INetworkListData,
} from "src/app/shared/app/models/MasterTables/claims/hospitals/i-network-list";
import { IHospitalsPreview } from "src/app/shared/app/models/MasterTables/claims/hospitals/i-hospitals-preview";

@Component({
  selector: "app-hospitals",
  templateUrl: "./hospitals.component.html",
  styleUrls: ["./hospitals.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HospitalsComponent implements OnInit, OnDestroy {
  lookupData!: Observable<IBaseMasterTable>;
  subscribes: Subscription[] = [];
  HospitalsFormSubmitted = false as boolean;
  HospitalsModal!: NgbModalRef;
  HospitalsForm!: FormGroup<IHospitals>;

  @ViewChild("HospitalsContent") HospitalsContent!: ElementRef;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IHospitals[],
    totalPages: 0,
    editHospitalsMode: false as Boolean,
    editHospitalsData: {} as IHospitalsData,
  };

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: hospitalsCols,
    suppressCsvExport: true,
    context: { comp: this },
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
    },
    overlayNoRowsTemplate:
      "<alert class='alert alert-secondary'>No Data To Show</alert>",
    onGridReady: (e) => this.onGridReady(e),
    onCellClicked: (e) => this.onCellClicked(e),
  };

  constructor(
    private message: MessagesService,
    private HospitalsService: HospitalsService,
    private eventService: EventService,
    private modalService: NgbModal,
    private table: MasterTableService
  ) {}

  ngOnInit(): void {
    this.initHospitalsForm();
    this.getLookupData();
  }

  getLookupData() {
    this.lookupData = this.table.getBaseData(MODULES.Hospitals);
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.HospitalsService.getHospitals().subscribe(
        (res: HttpResponse<IBaseResponse<IHospitals[]>>) => {
          if (res.body?.status) {
            this.uiState.list = res.body?.data!;
            params.successCallback(this.uiState.list, this.uiState.list.length);
            if (this.uiState.list.length === 0)
              this.gridApi.showNoRowsOverlay();
            else this.gridApi.hideOverlay();
          } else {
            this.message.popup("Oops!", res.body?.message!, "warning");
            this.gridApi.hideOverlay();
          }
        }
      );
      this.subscribes.push(sub);
    },
  };

  onCellClicked(params: CellEvent) {
    if (params.column.getColId() == "action") {
      params.api.getCellRendererInstances({
        rowNodes: [params.node],
        columns: [params.column],
      });
    }
  }

  onPageSizeChange() {
    this.gridApi.showLoadingOverlay();
    this.gridApi.setDatasource(this.dataSource);
  }

  onGridReady(param: GridReadyEvent) {
    this.gridApi = param.api;
    this.gridApi.setDatasource(this.dataSource);
    this.gridApi.sizeColumnsToFit();
  }

  openHospitalsDialoge(sno?: number) {
    this.HospitalsModal = this.modalService.open(this.HospitalsContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "xl",
    });
    if (sno) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.HospitalsService.getEditHospitalsData(sno).subscribe(
        (res: HttpResponse<IBaseResponse<IHospitalsPreview>>) => {
          if (res.body?.status) {
            this.uiState.editHospitalsMode = true;
            this.fillEditHospitalsForm(res.body?.data!);
            this.eventService.broadcast(reserved.isLoading, false);
          } else this.message.toast(res.body!.message!, "error");
        }
      );
      this.subscribes.push(sub);
    }

    this.HospitalsModal.hidden.subscribe(() => {
      this.resetHospitalsForm();
      this.HospitalsFormSubmitted = false;
      this.uiState.editHospitalsMode = false;
    });
  }

  initHospitalsForm() {
    this.HospitalsForm = new FormGroup<IHospitals>({
      sno: new FormControl(null),
      name: new FormControl("", Validators.required),
      city: new FormControl(""),
      tele: new FormControl("", Validators.pattern("[0-9]{9}")),
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
      phone: new FormControl(data?.phone || null, [
        Validators.pattern("[0-9]{9}"),
        Validators.required,
      ]),
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

    this.eventService.broadcast(reserved.isLoading, false);
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

    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.HospitalsService.saveHospitals(formData).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.HospitalsModal.dismiss();
          this.message.toast(res.body?.message!, "success");
        } else this.message.popup("Sorry!", res.body?.message!, "warning");
        this.eventService.broadcast(reserved.isLoading, false);
        this.gridApi.setDatasource(this.dataSource);
      }
    );
    this.subscribes.push(sub);
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

  DeleteHospitals(sno: number) {
    let sub = this.HospitalsService.DeleteHospitals(sno).subscribe(
      (res: HttpResponse<IBaseResponse<any>>) => {
        this.gridApi.setDatasource(this.dataSource);
        if (res.body?.status) this.message.toast(res.body!.message!, "success");
        else this.message.toast(res.body!.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
