import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { EventService } from "src/app/core/services/event.service";
import { Observable, Subscription } from 'rxjs';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { reserved } from 'src/app/core/models/reservedWord';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterTableService } from 'src/app/core/services/master-table.service';
import { IBaseMasterTable, IGenericResponseType } from 'src/app/core/models/masterTableModels';
import { MODULES } from 'src/app/core/models/MODULES';
import { ClaimsRejectionReasonsService } from 'src/app/shared/services/master-tables/claims/claims-rejection-reasons.service';
import { claimsRejectionReasonsCols } from 'src/app/shared/app/grid/claimsRejectionReasonsCols';
import { IClaimsRejectionReasons, IClaimsRejectionReasonsData } from 'src/app/shared/app/models/MasterTables/claims/i-claims-rejection-reasons';

@Component({
  selector: 'app-claims-rejection-reasons',
  templateUrl: './claims-rejection-reasons.component.html',
  styleUrls: [ './claims-rejection-reasons.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class ClaimsRejectionReasonsComponent implements OnInit, OnDestroy
{

  lookupData!: Observable<IBaseMasterTable>;
  ClaimsRejectionReasonsFormSubmitted = false as boolean;
  ClaimsRejectionReasonsModal!: NgbModalRef;
  ClaimsRejectionReasonsForm!: FormGroup<IClaimsRejectionReasons>;
  lineOfBussArr: IGenericResponseType[] = [];

  @ViewChild("ClaimsRejectionReasonsContent") ClaimsRejectionReasonsContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IClaimsRejectionReasons[],
    totalPages: 0,
    editClaimsRejectionReasonsMode: false as Boolean,
    editClaimsRejectionReasonsData: {} as IClaimsRejectionReasonsData,
    type: "Rejection"

  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi> {};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: claimsRejectionReasonsCols,
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
      let sub = this.ClaimsRejectionReasonsService.getClaimsRejectionReasons(this.uiState.type).subscribe(
        (res: HttpResponse<IBaseResponse<IClaimsRejectionReasons[]>>) =>
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

  constructor (
    private ClaimsRejectionReasonsService: ClaimsRejectionReasonsService,
    private message: MessagesService,
    private table: MasterTableService,
    private eventService: EventService,
    private modalService: NgbModal
  ) { }

  ngOnInit (): void
  {
    this.initClaimsRejectionReasonsForm();
    this.getLookupData();
  }

  getLookupData ()
  {
    this.lookupData = this.table.getBaseData(MODULES.ClaimsRejectionReasons);
  }

  DeleteClaimsRejectionReasons (sNo: number)
  {
    let sub = this.ClaimsRejectionReasonsService.DeleteClaimsRejectionReasons(sNo).subscribe(
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

  getClaimsRejectionReasonsData (sNo: number)
  {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.ClaimsRejectionReasonsService.getEditClaimsRejectionReasonsData(sNo).subscribe(
      (res: HttpResponse<IBaseResponse<IClaimsRejectionReasonsData>>) =>
      {
        this.uiState.editClaimsRejectionReasonsMode = true;
        this.uiState.editClaimsRejectionReasonsData = res.body?.data!;
        this.fillEditClaimsRejectionReasonsForm(res.body?.data!);
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

  openClaimsRejectionReasonsDialoge (sNo: number)
  {
    this.resetClaimsRejectionReasonsForm();
    this.ClaimsRejectionReasonsModal = this.modalService.open(this.ClaimsRejectionReasonsContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });

    this.getClaimsRejectionReasonsData(sNo);

    this.ClaimsRejectionReasonsModal.hidden.subscribe(() =>
    {
      this.resetClaimsRejectionReasonsForm();
      this.ClaimsRejectionReasonsFormSubmitted = false;
      this.uiState.editClaimsRejectionReasonsMode = false;
    });
  }

  initClaimsRejectionReasonsForm ()
  {
    this.ClaimsRejectionReasonsForm = new FormGroup<IClaimsRejectionReasons>({
      sNo: new FormControl(null),
      type: new FormControl("", Validators.required),
      rejectionReason: new FormControl("", Validators.required),
    })
  }

  get f ()
  {
    return this.ClaimsRejectionReasonsForm.controls;
  }

  fillAddClaimsRejectionReasonsForm (data: IClaimsRejectionReasonsData)
  {
    this.f.type?.patchValue(data.type!);
    this.f.rejectionReason?.patchValue(data.rejectionReason!);
  }

  fillEditClaimsRejectionReasonsForm (data: IClaimsRejectionReasonsData)
  {
    this.f.rejectionReason?.patchValue(data.rejectionReason!);
  }

  validationChecker (): boolean
  {
    if (this.ClaimsRejectionReasonsForm.invalid)
    {
      this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
      return false;
    }
    return true;
  }

  filter (e: any)
  {
    this.uiState.type = e?.name
    this.gridApi.setDatasource(this.dataSource);
  }

  submitClaimsRejectionReasonsData (form: FormGroup)
  {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IClaimsRejectionReasonsData = {
      sNo: this.uiState.editClaimsRejectionReasonsMode ? this.uiState.editClaimsRejectionReasonsData.sNo : 0,
      type: formData.type,
      rejectionReason: formData.claimNotes,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.ClaimsRejectionReasonsService.saveClaimsRejectionReasons(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) =>
      {
        this.ClaimsRejectionReasonsModal?.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetClaimsRejectionReasonsForm();
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

  resetClaimsRejectionReasonsForm ()
  {
    this.ClaimsRejectionReasonsForm.reset();
  }

  ngOnDestroy (): void
  {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }

}
