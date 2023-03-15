import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { EventService } from "src/app/core/services/event.service";
import { Observable, Subscription } from 'rxjs';
import { IBaseMasterTable } from 'src/app/core/models/masterTableModels';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { reserved } from 'src/app/core/models/reservedWord';
import { MasterTableService } from 'src/app/core/services/master-table.service';
import { MODULES } from 'src/app/core/models/MODULES';
import { HospitalsService } from 'src/app/shared/services/master-tables/claims/hospitals.service';
import { hospitalsCols } from 'src/app/shared/app/grid/hospitalsCols';
import { IHospitals, IHospitalsData } from 'src/app/shared/app/models/MasterTables/claims/hospitals/i-hospitals';
import { IContactList } from 'src/app/shared/app/models/MasterTables/claims/hospitals/i-contact-list';
import { INetworkList } from 'src/app/shared/app/models/MasterTables/claims/hospitals/i-network-list';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styleUrls: [ './hospitals.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class HospitalsComponent implements OnInit, OnDestroy
{

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

  gridApi: GridApi = <GridApi> {};
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

  constructor (
    private message: MessagesService,
    private HospitalsService: HospitalsService,
    private eventService: EventService,
    private modalService: NgbModal,
    private table: MasterTableService,
  ) { }

  ngOnInit (): void
  {
    this.initHospitalsForm();
    this.getLookupData();
  }

  getLookupData ()
  {
    this.lookupData = this.table.getBaseData(MODULES.Hospitals);
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();
      let sub = this.HospitalsService.getHospitals().subscribe(
        (res: HttpResponse<IBaseResponse<IHospitals[]>>) =>
        {
          this.uiState.list = res.body?.data!;
          params.successCallback(this.uiState.list, this.uiState.list.length);
          this.uiState.gridReady = true;
          this.gridApi.hideOverlay();
        },
        (err: HttpErrorResponse) =>
        {
          this.message.popup("Oops!", err.message, "error");
        }
      );
      this.subscribes.push(sub);
    },
  };

  onCellClicked (params: CellEvent)
  {
    if (params.column.getColId() == "action")
    {
      params.api.getCellRendererInstances({
        rowNodes: [ params.node ],
        columns: [ params.column ],
      });
    }
  }

  onPageSizeChange ()
  {
    this.gridApi.showLoadingOverlay();
    this.gridApi.setDatasource(this.dataSource);
  }

  onGridReady (param: GridReadyEvent)
  {
    this.gridApi = param.api;
    this.gridApi.setDatasource(this.dataSource);
    // this.gridApi.sizeColumnsToFit();
  }

  openHospitalsDialoge (sno?: number)
  {
    this.resetHospitalsForm();
    this.HospitalsModal = this.modalService.open(this.HospitalsContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "xl",
    });
    if (sno)
    {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.HospitalsService.getEditHospitalsData(sno).subscribe(
        (res: HttpResponse<IBaseResponse<IHospitalsData>>) =>
        {
          this.uiState.editHospitalsMode = true;
          this.uiState.editHospitalsData = res.body?.data!;
          this.fillEditHospitalsForm(res.body?.data!);
          this.eventService.broadcast(reserved.isLoading, false);
        },
        (err: HttpErrorResponse) =>
        {
          this.message.popup("Oops!", err.message, "error");
          this.eventService.broadcast(reserved.isLoading, false);
        }
      );
      this.subscribes.push(sub);
    }

    this.HospitalsModal.hidden.subscribe(() =>
    {
      this.resetHospitalsForm();
      this.HospitalsFormSubmitted = false;
      this.uiState.editHospitalsMode = false;
    });
  }

  initHospitalsForm ()
  {
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
    })
  }

  get f ()
  {
    return this.HospitalsForm.controls;
  }

  //#network List Array 
  get networkListArray (): FormArray
  {
    return this.HospitalsForm.get("networkList") as FormArray;
  }

  //get network List Controls
  networkLisControls (i: number, control: string): AbstractControl
  {
    return this.networkListArray.controls[ i ].get(control)!;
  }
  //#contact List Array
  get contactListArray (): FormArray
  {
    return this.HospitalsForm.get("contactList") as FormArray;
  }
  //get contact List Controls
  contactListControls (i: number, control: string): AbstractControl
  {
    return this.contactListArray.controls[ i ].get(control)!;
  }
  addNetwork (data?: INetworkList)
  {
    if (this.f.networkList?.invalid)
    {
      this.f.networkList?.markAllAsTouched();
      return;
    }
    let network = new FormGroup<INetworkList>({
      sNo: new FormControl(data?.sNo || null),
      HospitalName: new FormControl(data?.HospitalName || null),
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
      HospitalId: new FormControl(data?.HospitalId || null),
      SavedUser: new FormControl(data?.SavedUser || null),
    });

    if (!data) network.reset();
    else network.disable();

    this.f.networkList?.push(network);
    this.networkListArray.updateValueAndValidity();
  }

  addContact (data?: IContactList)
  {
    if (this.f.contactList?.invalid)
    {
      this.f.contactList?.markAllAsTouched();
      return;
    }
    let contact = new FormGroup<IContactList>({
      sNo: new FormControl(data?.sNo || null),
      Name: new FormControl(data?.Name || null),
      Position: new FormControl(data?.Position || null),
      Email: new FormControl(data?.Email || null),
      Phone: new FormControl(data?.Phone || null),
      HospitalId: new FormControl(data?.HospitalId || null),
      SavedUser: new FormControl(data?.SavedUser || null),
    });

    if (!data) contact.reset();
    else contact.disable();

    this.f.contactList?.push(contact);
    this.contactListArray.updateValueAndValidity();
  }

  remove (i: number, type: string)
  {
    if (type === "network") this.networkListArray.removeAt(i);
    else if (type === "contact") this.contactListArray.removeAt(i);
    else return;
  }

  enableEditingRow (i: number, type: string)
  {
    if (type === "network") this.networkListArray.at(i).enable();
    else if (type === "contact") this.contactListArray.at(i).enable();
    else return;
  }
  //#endregion

  fillAddHospitalsForm (data: IHospitalsData)
  {
    this.f.name?.patchValue(data.name!);
    this.f.city?.patchValue(data.city!);
    this.f.address?.patchValue(data.address!);
    this.f.email?.patchValue(data.email!);
    this.f.tele?.patchValue(data.tele!);
    this.f.fax?.patchValue(data.fax!);
    this.f.specialties?.patchValue(data.specialties!);
    this.f.region?.patchValue(data.region!);
    data.networkList?.forEach((sr: any) => this.addNetwork(sr));
    data.contactList?.forEach((sr: any) => this.addContact(sr));
  }

  fillEditHospitalsForm (data: IHospitalsData)
  {

    this.f.name?.patchValue(data.name!);
    this.f.city?.patchValue(data.city!);
    this.f.address?.patchValue(data.address!);
    this.f.email?.patchValue(data.email!);
    this.f.tele?.patchValue(data.tele!);
    this.f.fax?.patchValue(data.fax!);
    this.f.specialties?.patchValue(data.specialties!);
    this.f.region?.patchValue(data.region!);
    data.networkList?.forEach((sr: any) => this.addNetwork(sr));
    data.contactList?.forEach((sr: any) => this.addContact(sr));
    this.f.name?.disable();
    this.f.city?.disable();
    this.f.address?.disable();
    this.f.email?.disable();
    this.f.tele?.disable();
    this.f.fax?.disable();
    this.f.specialties?.disable();
    this.f.region?.disable();
  }

  validationChecker (): boolean
  {
    if (this.HospitalsForm.invalid)
    {
      this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
      return false;
    }
    return true;
  }

  submitHospitalsData (form: FormGroup)
  {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IHospitalsData = {
      sno: this.uiState.editHospitalsMode ? this.uiState.editHospitalsData.sno : 0,
      name: formData.name,
      city: formData.city,
      address: formData.address,
      email: formData.email,
      tele: formData.tele,
      fax: formData.fax,
      specialties: formData.specialties,
      region: formData.region,
      networkList: formData.networkList,
      contactList: formData.contactList,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.HospitalsService.saveHospitals(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) =>
      {
        this.HospitalsModal.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetHospitalsForm();
        this.gridApi.setDatasource(this.dataSource);
        this.message.toast(res.body?.message!, "success");
      },
      (err: HttpErrorResponse) =>
      {
        this.message.popup("Oops!", err.error.message, "error");
        this.eventService.broadcast(reserved.isLoading, false);
      }
    );
    this.subscribes.push(sub);
  }

  resetHospitalsForm ()
  {
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

  DeleteHospitals (sno: number)
  {
    let sub = this.HospitalsService.DeleteHospitals(sno).subscribe(
      (res: HttpResponse<IBaseResponse<any>>) =>
      {
        this.gridApi.setDatasource(this.dataSource);
        if (res.body?.status) this.message.toast(res.body!.message!, "success");
        else this.message.toast(res.body!.message!, "error");
      },
      (err: HttpErrorResponse) =>
      {
        this.message.popup("Oops!", err.message, "error");
      }
    );
    this.subscribes.push(sub);
  }

  ngOnDestroy (): void
  {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }

}
