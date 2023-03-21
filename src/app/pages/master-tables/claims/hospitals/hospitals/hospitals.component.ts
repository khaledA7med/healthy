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
          this.uiState.list = res.body?.data!;
          params.successCallback(this.uiState.list, this.uiState.list.length);
          this.uiState.gridReady = true;
          this.gridApi.hideOverlay();
        },
        (err: HttpErrorResponse) => {
          this.message.popup("Oops!", err.message, "error");
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
      name: new FormControl(null, Validators.required),
      city: new FormControl(null),
      tele: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      fax: new FormControl(null),
      address: new FormControl(null),
      specialties: new FormControl(null),
      region: new FormControl(null),
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
  networkLisControls(i: number, control: string): AbstractControl {
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
      InsurCompany: new FormControl(data?.InsurCompany || null),
      ClassA: new FormControl(data?.ClassA || null),
      ClassAm: new FormControl(data?.ClassAm || null),
      ClassAp: new FormControl(data?.ClassAp || null),
      ClassB: new FormControl(data?.ClassB || null),
      ClassBm: new FormControl(data?.ClassBm || null),
      ClassBp: new FormControl(data?.ClassBp || null),
      ClassC: new FormControl(data?.ClassC || null),
      ClassCa: new FormControl(data?.ClassCa || null),
      ClassCae: new FormControl(data?.ClassCae || null),
      ClassCD: new FormControl(data?.ClassCD || null),
      ClassCm: new FormControl(data?.ClassCm || null),
      ClassCp: new FormControl(data?.ClassCp || null),
      ClassE: new FormControl(data?.ClassE || null),
      ClassVip: new FormControl(data?.ClassVip || null),
      ClassVvip: new FormControl(data?.ClassVvip || null),
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
      Name: new FormControl(data?.Name || null),
      Position: new FormControl(data?.Position || null),
      Email: new FormControl(data?.Email || null),
      Phone: new FormControl(data?.Phone || null),
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
      data?.contactList!.forEach((el) => this.addContact(el));
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

    this.eventService.broadcast(reserved.isLoading, true);
    const formData = new FormData();

    let val = HospitalsForm.getRawValue();

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
      formData.append(`contactList[${i}]`, contact[i].Email! ?? "");
      formData.append(`contactList[${i}]`, contact[i].Name! ?? "");
      formData.append(`contactList[${i}]`, contact[i].Position! ?? "");
      formData.append(`contactList[${i}]`, contact[i].Phone! ?? "");
    }

    this.networkListArray.controls.forEach((el) => el.enable());
    let network = val.networkList!;
    for (let i = 0; i < network.length; i++) {
      formData.append(`networkList[${i}]`, network[i].InsurCompany! ?? "");
      formData.append(
        `networkList[${i}]`,
        network[i].ClassVvip?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].ClassVip?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].ClassA?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].ClassAm?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].ClassAp?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].ClassB?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].ClassBm?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].ClassBp?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].ClassC?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].ClassCD?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].ClassCa?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].ClassCae?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].ClassCm?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].ClassCp?.toString()! ?? ""
      );
      formData.append(
        `networkList[${i}]`,
        network[i].ClassE?.toString()! ?? ""
      );
    }

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
