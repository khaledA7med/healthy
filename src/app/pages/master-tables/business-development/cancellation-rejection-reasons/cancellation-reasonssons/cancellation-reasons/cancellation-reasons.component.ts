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
import { cancellationReasonsCols } from 'src/app/shared/app/grid/cancellationReasonsCols';
import { CancellationReasonsService } from 'src/app/shared/services/master-tables/business-development/cancellation-rejection-reasons/cancellation-reasons.service';
import { ICancellationReasons, ICancellationReasonsData } from 'src/app/shared/app/models/MasterTables/business-development/cancellation-rejection-reasons/i-cancellation-reasons';

@Component({
  selector: 'app-cancellation-reasons',
  templateUrl: './cancellation-reasons.component.html',
  styleUrls: [ './cancellation-reasons.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class CancellationReasonsComponent implements OnInit, OnDestroy
{

  CancellationReasonsFormSubmitted = false as boolean;
  CancellationReasonsModal!: NgbModalRef;
  CancellationReasonsForm!: FormGroup<ICancellationReasons>;
  @ViewChild("CancellationReasonsContent") CancellationReasonsContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as ICancellationReasons[],
    totalPages: 0,
    editCancellationReasonsMode: false as Boolean,
    editCancellationReasonsData: {} as ICancellationReasonsData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi> {};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: cancellationReasonsCols,
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
    private CancellationReasonsService: CancellationReasonsService,
    private tableRef: ElementRef,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) { }

  ngOnInit (): void
  {
    this.initCancellationReasonsForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();
      let sub = this.CancellationReasonsService.getCancellationReasons().subscribe(
        (res: HttpResponse<IBaseResponse<ICancellationReasons[]>>) =>
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

  openCancellationReasonsDialoge (id?: string)
  {
    this.resetCancellationReasonsForm();
    this.CancellationReasonsModal = this.modalService.open(this.CancellationReasonsContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });
    if (id)
    {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.CancellationReasonsService.getEditCancellationReasons(id).subscribe(
        (res: HttpResponse<IBaseResponse<ICancellationReasonsData>>) =>
        {
          this.uiState.editCancellationReasonsMode = true;
          this.uiState.editCancellationReasonsData = res.body?.data!;
          this.fillAddCancellationReasonsForm(res.body?.data!);
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

    this.CancellationReasonsModal.hidden.subscribe(() =>
    {
      this.resetCancellationReasonsForm();
      this.CancellationReasonsFormSubmitted = false;
      this.uiState.editCancellationReasonsMode = false;
    });
  }

  initCancellationReasonsForm ()
  {
    this.CancellationReasonsForm = new FormGroup<ICancellationReasons>({
      sNo: new FormControl(null),
      reason: new FormControl(null, Validators.required),
    })
  }

  get f ()
  {
    return this.CancellationReasonsForm.controls;
  }

  fillAddCancellationReasonsForm (data: ICancellationReasonsData)
  {
    this.f.reason?.patchValue(data.reason!);
  }

  fillEditCancellationReasonsForm (data: ICancellationReasonsData)
  {
    this.f.reason?.patchValue(data.reason!);
  }

  validationChecker (): boolean
  {
    if (this.CancellationReasonsForm.invalid)
    {
      this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
      return false;
    }
    return true;
  }

  submitCancellationReasonsData (form: FormGroup)
  {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: ICancellationReasonsData = {
      sNo: this.uiState.editCancellationReasonsMode ? this.uiState.editCancellationReasonsData.sNo : 0,
      reason: formData.reason,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.CancellationReasonsService.saveCancellationReasons(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) =>
      {
        this.CancellationReasonsModal.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetCancellationReasonsForm();
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

  resetCancellationReasonsForm ()
  {
    this.CancellationReasonsForm.reset();
  }

  DeleteCancellationReasons (id: string)
  {
    let sub = this.CancellationReasonsService.DeleteCancellationReasons(id).subscribe(
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
