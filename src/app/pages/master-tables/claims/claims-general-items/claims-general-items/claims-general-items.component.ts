import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
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
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { reserved } from "src/app/core/models/reservedWord";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MasterTableService } from "src/app/core/services/master-table.service";
import {
  Caching,
  IBaseMasterTable,
  IGenericResponseType,
} from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { ClaimsGeneralItemsService } from "src/app/shared/services/master-tables/claims/claims-general-items.service";
import { claimsGeneralItemsCols } from "src/app/shared/app/grid/claimsGeneralItemsCols";
import {
  IClaimsGeneralItems,
  IClaimsGeneralItemsData,
} from "src/app/shared/app/models/MasterTables/claims/i-claims-general-items";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";

@Component({
  selector: "app-claims-general-items",
  templateUrl: "./claims-general-items.component.html",
  styleUrls: ["./claims-general-items.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ClaimsGeneralItemsComponent implements OnInit, OnDestroy {
  lookupData!: Observable<IBaseMasterTable>;
  ClaimsGeneralItemsFormSubmitted = false as boolean;
  ClaimsGeneralItemsModal!: NgbModalRef;
  ClaimsGeneralItemsForm!: FormGroup<IClaimsGeneralItems>;
  lineOfBussArr: IGenericResponseType[] = [];
  isChecked!: number;

  @ViewChild("ClaimsGeneralItemsContent")
  ClaimsGeneralItemsContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IClaimsGeneralItems[],
    totalPages: 0,
    editClaimsGeneralItemsMode: false as Boolean,
    editClaimsGeneralItemsData: {} as IClaimsGeneralItemsData,
    classOfInsurance: "Accident",
    lineofBusiness: "Group Personal Accident",
    mandatory: 0,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: claimsGeneralItemsCols,
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

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      const data: IClaimsGeneralItemsData = {
        classOfInsurance: this.uiState.classOfInsurance,
        lineofBusiness: this.uiState.lineofBusiness,
      };
      let sub = this.ClaimsGeneralItemsService.getClaimsGeneralItems(
        data
      ).subscribe((res: HttpResponse<IBaseResponse<IClaimsGeneralItems[]>>) => {
        if (res.body?.status) {
          this.uiState.list = res.body?.data!;
          params.successCallback(this.uiState.list, this.uiState.list.length);
          if (this.uiState.list.length === 0) this.gridApi.showNoRowsOverlay();
          else this.gridApi.hideOverlay();
        } else {
          this.uiState.gridReady = true;
          this.gridApi.hideOverlay();
        }
      });
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

  constructor(
    private masterService: MasterMethodsService,
    private ClaimsGeneralItemsService: ClaimsGeneralItemsService,
    private message: MessagesService,
    private table: MasterTableService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initClaimsGeneralItemsForm();
    this.getLookupData();
  }

  getLookupData() {
    this.lookupData = this.table.getBaseData(MODULES.ClaimsGeneralItems);
  }

  getLineOfBusiness(className: string) {
    let sub = this.masterService
      .getLineOfBusiness(className)
      .subscribe(
        (res: HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>) => {
          if (res.body?.status) {
            this.lineOfBussArr = res.body?.data?.content!;
          } else this.message.toast(res.body?.message!, "error");
        }
      );
    this.subscribes.push(sub);
  }

  DeleteClaimsGeneralItems(sno: number) {
    let sub = this.ClaimsGeneralItemsService.DeleteClaimsGeneralItems(
      sno
    ).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
      this.gridApi.setDatasource(this.dataSource);
      if (res.body?.status) this.message.toast(res.body!.message!, "success");
      else this.message.toast(res.body!.message!, "error");
    });
    this.subscribes.push(sub);
  }

  checkValue(event: any) {
    this.uiState.mandatory = event;
  }

  getClaimsGeneralItemsData(sno: number) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.ClaimsGeneralItemsService.getEditClaimsGeneralItemsData(
      sno
    ).subscribe((res: HttpResponse<IBaseResponse<IClaimsGeneralItemsData>>) => {
      if (res.body?.status) {
        this.uiState.editClaimsGeneralItemsMode = true;
        this.uiState.editClaimsGeneralItemsData = res.body?.data!;
        this.fillEditClaimsGeneralItemsForm(res.body?.data!);
        this.eventService.broadcast(reserved.isLoading, false);
      } else this.message.toast(res.body!.message!, "error");
    });
    this.subscribes.push(sub);
  }

  openClaimsGeneralItemsDialoge(sno: number) {
    this.resetClaimsGeneralItemsForm();
    this.ClaimsGeneralItemsModal = this.modalService.open(
      this.ClaimsGeneralItemsContent,
      {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        size: "md",
      }
    );

    this.getClaimsGeneralItemsData(sno);

    this.ClaimsGeneralItemsModal.hidden.subscribe(() => {
      this.resetClaimsGeneralItemsForm();
      this.ClaimsGeneralItemsFormSubmitted = false;
      this.uiState.editClaimsGeneralItemsMode = false;
    });
  }

  initClaimsGeneralItemsForm() {
    this.ClaimsGeneralItemsForm = new FormGroup<IClaimsGeneralItems>({
      sno: new FormControl(null),
      item: new FormControl("", Validators.required),
      classOfInsurance: new FormControl("", Validators.required),
      lineofBusiness: new FormControl("", Validators.required),
      mandatory: new FormControl(""),
    });
  }

  get f() {
    return this.ClaimsGeneralItemsForm.controls;
  }

  fillAddClaimsGeneralItemsForm(data: IClaimsGeneralItemsData) {
    this.f.item?.patchValue(data.item!);
    this.f.classOfInsurance?.patchValue(data.classOfInsurance!);
    this.f.lineofBusiness?.patchValue(data.lineofBusiness!);
    this.f.mandatory?.patchValue(data.mandatory!);
  }

  fillEditClaimsGeneralItemsForm(data: IClaimsGeneralItemsData) {
    this.f.classOfInsurance?.patchValue(data.classOfInsurance!);
    this.f.lineofBusiness?.patchValue(data.lineofBusiness!);
    this.f.item?.patchValue(data.item!);
    this.f.mandatory?.patchValue(data.mandatory!);
    this.f.classOfInsurance?.disable();
    this.f.lineofBusiness?.disable();
  }

  validationChecker(): boolean {
    if (this.ClaimsGeneralItemsForm.invalid) {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  changeClass(e: any) {
    this.uiState.classOfInsurance = e?.name;
  }

  filter(e: any) {
    this.uiState.lineofBusiness = e?.name;
    this.gridApi.setDatasource(this.dataSource);
  }

  submitClaimsGeneralItemsData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IClaimsGeneralItemsData = {
      sno: this.uiState.editClaimsGeneralItemsMode
        ? this.uiState.editClaimsGeneralItemsData.sno
        : 0,
      item: formData.item,
      classOfInsurance: formData.classOfInsurance,
      lineofBusiness: formData.lineofBusiness,
      mandatory: formData.mandatory,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.ClaimsGeneralItemsService.saveClaimsGeneralItems(
      data
    ).subscribe((res: HttpResponse<IBaseResponse<number>>) => {
      if (res.body?.status) {
        this.ClaimsGeneralItemsModal?.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetClaimsGeneralItemsForm();
        this.gridApi.setDatasource(this.dataSource);
        this.message.toast(res.body?.message!, "success");
      } else this.message.toast(res.body!.message!, "error");
    });
    this.subscribes.push(sub);
  }

  resetClaimsGeneralItemsForm() {
    this.ClaimsGeneralItemsForm.reset();
    this.f.classOfInsurance?.enable();
    this.f.lineofBusiness?.enable();
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
