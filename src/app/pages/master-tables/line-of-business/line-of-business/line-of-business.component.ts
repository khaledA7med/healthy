import { HttpResponse } from "@angular/common/http";
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
import {
  ILineOfBusiness,
  ILineOfBusinessData,
} from "src/app/shared/app/models/MasterTables/i-line-of-business";
import { LineOfBusinessService } from "src/app/shared/services/master-tables/line-of-business.service";
import { lineOfBusinessCols } from "src/app/shared/app/grid/lineOfBusinessCols";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";

@Component({
  selector: "app-line-of-business",
  templateUrl: "./line-of-business.component.html",
  styleUrls: ["./line-of-business.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LineOfBusinessComponent implements OnInit, OnDestroy {
  lookupData!: Observable<IBaseMasterTable>;
  LineOfBussinessFormSubmitted = false as boolean;
  LineOfBussinessModal!: NgbModalRef;
  LineOfBussinessForm!: FormGroup<ILineOfBusiness>;

  @ViewChild("LineOfBussinessContent")
  LineOfBussinessContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as ILineOfBusiness[],
    totalPages: 0,
    editLineOfBusinessMode: false as Boolean,
    editLineOfBusinessData: {} as ILineOfBusinessData,
    className: "Accident",
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: lineOfBusinessCols,
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

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.LineOfBusinessService.getLineOfBusiness(
        this.uiState.className
      ).subscribe((res: HttpResponse<IBaseResponse<ILineOfBusiness[]>>) => {
        if (res.body?.status) {
          this.uiState.list = res.body?.data!;
          params.successCallback(this.uiState.list, this.uiState.list.length);
          if (this.uiState.list.length === 0) this.gridApi.showNoRowsOverlay();
          else this.gridApi.hideOverlay();
        } else {
          this.message.popup("Oops!", res.body?.message!, "warning");
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
    private LineOfBusinessService: LineOfBusinessService,
    private message: MessagesService,
    private table: MasterTableService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initLineOfBusinessForm();
    this.getLookupData();
    this.f.className?.patchValue(this.uiState.className);
  }

  getLookupData() {
    this.lookupData = this.table.getBaseData(MODULES.LineOfBusiness);
  }

  DeleteLineOfBusiness(id: string, lineofBusiness: string) {
    let sub = this.LineOfBusinessService.DeleteLineOfBusiness(
      id,
      lineofBusiness
    ).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
      this.gridApi.setDatasource(this.dataSource);
      if (res.body?.status) this.message.toast(res.body!.message!, "success");
      else this.message.toast(res.body!.message!, "error");
    });
    this.subscribes.push(sub);
  }

  getLineOfBusinessData(id: string) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.LineOfBusinessService.getEditLineOfBusinessData(
      id
    ).subscribe((res: HttpResponse<IBaseResponse<ILineOfBusinessData>>) => {
      if (res.body?.status) {
        this.uiState.editLineOfBusinessMode = true;
        this.uiState.editLineOfBusinessData = res.body?.data!;
        this.fillEditLineOfBusinessForm(res.body?.data!);
        this.eventService.broadcast(reserved.isLoading, false);
      } else this.message.toast(res.body!.message!, "error");
    });
    this.subscribes.push(sub);
  }

  openLineOfBusinessDialoge(id: string) {
    this.resetLineOfBusinessForm();
    this.LineOfBussinessModal = this.modalService.open(
      this.LineOfBussinessContent,
      {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        size: "md",
      }
    );

    this.getLineOfBusinessData(id);

    this.LineOfBussinessModal.hidden.subscribe(() => {
      this.resetLineOfBusinessForm();
      this.LineOfBussinessFormSubmitted = false;
      this.uiState.editLineOfBusinessMode = false;
    });
  }

  initLineOfBusinessForm() {
    this.LineOfBussinessForm = new FormGroup<ILineOfBusiness>({
      sNo: new FormControl(null),
      className: new FormControl("", Validators.required),
      lineofBusiness: new FormControl("", Validators.required),
      lineofBusinessAr: new FormControl(""),
      abbreviation: new FormControl("", Validators.required),
    });
  }

  get f() {
    return this.LineOfBussinessForm.controls;
  }

  fillAddLineOfBusinessForm(data: ILineOfBusinessData) {
    this.f.className?.patchValue(data.className!);
    this.f.lineofBusiness?.patchValue(data.lineofBusiness!);
    this.f.lineofBusinessAr?.patchValue(data.lineofBusinessAr!);
    this.f.abbreviation?.patchValue(data.abbreviation!);
  }

  fillEditLineOfBusinessForm(data: ILineOfBusinessData) {
    this.f.className?.patchValue(data.className!);
    this.f.lineofBusiness?.patchValue(data.lineofBusiness!);
    this.f.lineofBusinessAr?.patchValue(data.lineofBusinessAr!);
    this.f.abbreviation?.patchValue(data.abbreviation!);
    this.f.className?.disable();
  }

  validationChecker(): boolean {
    if (this.LineOfBussinessForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  filter(e: any) {
    this.uiState.className = e?.name;
    this.gridApi.setDatasource(this.dataSource);
  }

  submitLineOfBusinessData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: ILineOfBusinessData = {
      sNo: this.uiState.editLineOfBusinessMode
        ? this.uiState.editLineOfBusinessData.sNo
        : 0,
      className: formData.className,
      lineofBusiness: formData.lineofBusiness,
      lineofBusinessAr: formData.lineofBusinessAr,
      abbreviation: formData.abbreviation,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.LineOfBusinessService.saveLineOfBusiness(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.LineOfBussinessModal?.dismiss();
          this.eventService.broadcast(reserved.isLoading, false);
          this.uiState.submitted = false;
          this.resetLineOfBusinessForm();
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res.body?.message!, "success");
        } else this.message.toast(res.body!.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  resetLineOfBusinessForm() {
    this.LineOfBussinessForm.reset();
    this.f.className?.enable();
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
