import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { EventService } from "src/app/core/services/event.service";
import { Subscription } from 'rxjs';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { MessagesService } from 'src/app/shared/services/messages.service';
import AppUtils from 'src/app/shared/app/util';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import PerfectScrollbar from 'perfect-scrollbar';
import { reserved } from 'src/app/core/models/reservedWord';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ILineOfBusiness, ILineOfBusinessData } from 'src/app/shared/app/models/MasterTables/i-line-of-business';
import { LineOfBusinessService } from 'src/app/shared/services/master-tables/line-of-business.service';
import { lineOfBusinessCols } from 'src/app/shared/app/grid/lineOfBusinessCols';


@Component({
  selector: 'app-line-of-business',
  templateUrl: './line-of-business.component.html',
  styleUrls: [ './line-of-business.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class LineOfBusinessComponent implements OnInit
{

  LineOfBBussinessFormSubmitted = false as boolean;
  LineOfBBussinessModal!: NgbModalRef;
  LineOfBBussinessForm!: FormGroup;

  @ViewChild("LineOfBBussinessContent") LineOfBBussinessContent!: ElementRef;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as ILineOfBusiness[],
    totalPages: 0,
    editLineOfBusinessMode: false as Boolean,
    editLineOfBusinessData: {} as ILineOfBusinessData,
    className: ""

  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi> {};
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
    onGridReady: (e) => this.onGridReady(e),
    onCellClicked: (e) => this.onCellClicked(e),
  };

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();
      let sub = this.LineOfBusinessService.getLineOfBusiness(this.uiState.className).subscribe(
        (res: HttpResponse<IBaseResponse<ILineOfBusiness[]>>) =>
        {
          this.uiState.list = res.body?.data!;
          params.successCallback(this.uiState.list);
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

    const agBodyHorizontalViewport: HTMLElement = this.tableRef.nativeElement.querySelector("#gridScrollbar .ag-body-horizontal-scroll-viewport");
    const agBodyViewport: HTMLElement = this.tableRef.nativeElement.querySelector("#gridScrollbar .ag-body-viewport");

    if (agBodyViewport)
    {
      const vertical = new PerfectScrollbar(agBodyViewport);
      vertical.update();
    }
    if (agBodyHorizontalViewport)
    {
      const horizontal = new PerfectScrollbar(agBodyHorizontalViewport);
      horizontal.update();
    }
    if ((this, this.uiState.list.length > 0)) this.gridApi.sizeColumnsToFit();
  }

  constructor (
    private LineOfBusinessService: LineOfBusinessService,
    private tableRef: ElementRef,
    private message: MessagesService,
    private appUtils: AppUtils,
    private eventService: EventService,
    private modalService: NgbModal
  ) { }

  ngOnInit (): void
  {
  }

  DeleteLineOfBusiness (id: string)
  {
    let sub = this.LineOfBusinessService.DeleteLineOfBusiness(id).subscribe(
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


  openLineOfBusinessDialoge (id?: string)
  {
    this.resetLineOfBusinessForm();
    this.LineOfBBussinessModal = this.modalService.open(this.LineOfBBussinessContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });
    if (id)
    {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.LineOfBusinessService.getEditLineOfBusinessData(id).subscribe(
        (res: HttpResponse<IBaseResponse<ILineOfBusinessData>>) =>
        {
          this.uiState.editLineOfBusinessMode = true;
          this.uiState.editLineOfBusinessData = res.body?.data!;
          this.fillEditInsuranceForm(res.body?.data!);
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

    this.LineOfBBussinessModal.hidden.subscribe(() =>
    {
      this.resetLineOfBusinessForm();
      this.LineOfBBussinessFormSubmitted = false;
      this.uiState.editLineOfBusinessMode = false;
    });
  }

  initLineOfBusinessForm ()
  {
    this.LineOfBBussinessForm = new FormGroup<ILineOfBusiness>({
      sNo: new FormControl(null),
      className: new FormControl(null, Validators.required),
      lineofBusiness: new FormControl(null, Validators.required),
      lineofBusinessAr: new FormControl(null),
      abbreviation: new FormControl(null, Validators.required),
    })
  }

  get f ()
  {
    return this.LineOfBBussinessForm.controls;
  }

  fillAddIsnuranceForm (data: ILineOfBusinessData)
  {
    this.f[ "className" ].patchValue(data.className);
    this.f[ "lineofBusiness" ].patchValue(data.lineofBusiness);
    this.f[ "lineofBusinessAr" ].patchValue(data.lineofBusinessAr);
    this.f[ "abbreviation" ].patchValue(data.abbreviation);
  }

  fillEditInsuranceForm (data: ILineOfBusinessData)
  {
    this.f[ "lineofBusiness" ].patchValue(data.lineofBusiness);
    this.f[ "lineofBusinessAr" ].patchValue(data.lineofBusinessAr);
    this.f[ "abbreviation" ].patchValue(data.abbreviation);

  }

  validationChecker (): boolean
  {
    if (this.LineOfBBussinessForm.invalid)
    {
      this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
      return false;
    }
    return true;
  }

  submitLineOfBusinessData (form: FormGroup)
  {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: ILineOfBusinessData = {
      sNo: this.uiState.editLineOfBusinessMode ? this.uiState.editLineOfBusinessData.sNo : 0,
      className: formData.className,
      lineofBusiness: formData.lineofBusiness,
      lineofBusinessAr: formData.lineofBusinessAr,
      abbreviation: formData.abbreviation,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.LineOfBusinessService.saveLineOfBusiness(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) =>
      {
        this.LineOfBBussinessModal.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetLineOfBusinessForm();
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

  resetLineOfBusinessForm ()
  {
    this.LineOfBBussinessForm.reset();
  }

  ngOnDestroy (): void
  {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }

}
