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
import { ClientRejectionReasonsCols } from 'src/app/shared/app/grid/clientRejectionReasonsCols';
import { ClientRejectionReasonsService } from 'src/app/shared/services/master-tables/business-development/cancellation-rejection-reasons/client-rejection-reasons.service';
import { IClientRejectionReasons, IClientRejectionReasonsData } from 'src/app/shared/app/models/MasterTables/business-development/cancellation-rejection-reasons/i-client-rejection-reasons';

@Component({
  selector: 'app-client-rejection-reasons',
  templateUrl: './client-rejection-reasons.component.html',
  styleUrls: [ './client-rejection-reasons.component.scss' ],
  encapsulation: ViewEncapsulation.None,

})
export class ClientRejectionReasonsComponent implements OnInit, OnDestroy
{

  ClientRejectionReasonsFormSubmitted = false as boolean;
  ClientRejectionReasonsModal!: NgbModalRef;
  ClientRejectionReasonsForm!: FormGroup<IClientRejectionReasons>;
  @ViewChild("ClientRejectionReasonsContent") ClientRejectionReasonsContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IClientRejectionReasons[],
    totalPages: 0,
    editClientRejectionReasonsMode: false as Boolean,
    editClientRejectionReasonsData: {} as IClientRejectionReasonsData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi> {};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: ClientRejectionReasonsCols,
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
    private ClientRejectionReasonsService: ClientRejectionReasonsService,
    private tableRef: ElementRef,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) { }

  ngOnInit (): void
  {
    this.initClientRejectionReasonsForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();
      let sub = this.ClientRejectionReasonsService.getClientRejectionReasons().subscribe(
        (res: HttpResponse<IBaseResponse<IClientRejectionReasons[]>>) =>
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

  openClientRejectionReasonsDialoge (id?: string)
  {
    this.resetClientRejectionReasonsForm();
    this.ClientRejectionReasonsModal = this.modalService.open(this.ClientRejectionReasonsContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });
    if (id)
    {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.ClientRejectionReasonsService.getEditClientRejectionReasons(id).subscribe(
        (res: HttpResponse<IBaseResponse<IClientRejectionReasonsData>>) =>
        {
          this.uiState.editClientRejectionReasonsMode = true;
          this.uiState.editClientRejectionReasonsData = res.body?.data!;
          this.fillAddClientRejectionReasonsForm(res.body?.data!);
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

    this.ClientRejectionReasonsModal.hidden.subscribe(() =>
    {
      this.resetClientRejectionReasonsForm();
      this.ClientRejectionReasonsFormSubmitted = false;
      this.uiState.editClientRejectionReasonsMode = false;
    });
  }

  initClientRejectionReasonsForm ()
  {
    this.ClientRejectionReasonsForm = new FormGroup<IClientRejectionReasons>({
      sNo: new FormControl(null),
      reason: new FormControl(null, Validators.required),
    })
  }

  get f ()
  {
    return this.ClientRejectionReasonsForm.controls;
  }

  fillAddClientRejectionReasonsForm (data: IClientRejectionReasonsData)
  {
    this.f.reason?.patchValue(data.reason!);
  }

  fillEditClientRejectionReasonsForm (data: IClientRejectionReasonsData)
  {
    this.f.reason?.patchValue(data.reason!);
  }

  validationChecker (): boolean
  {
    if (this.ClientRejectionReasonsForm.invalid)
    {
      this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
      return false;
    }
    return true;
  }

  submitClientRejectionReasonsData (form: FormGroup)
  {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IClientRejectionReasonsData = {
      sNo: this.uiState.editClientRejectionReasonsMode ? this.uiState.editClientRejectionReasonsData.sNo : 0,
      reason: formData.reason,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.ClientRejectionReasonsService.saveClientRejectionReasons(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) =>
      {
        this.ClientRejectionReasonsModal.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetClientRejectionReasonsForm();
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

  resetClientRejectionReasonsForm ()
  {
    this.ClientRejectionReasonsForm.reset();
  }

  DeleteClientRejectionReasons (id: string)
  {
    let sub = this.ClientRejectionReasonsService.DeleteClientRejectionReasons(id).subscribe(
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