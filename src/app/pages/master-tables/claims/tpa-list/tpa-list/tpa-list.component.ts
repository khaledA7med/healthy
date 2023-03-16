import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { EventService } from "src/app/core/services/event.service";
import { Subscription } from 'rxjs';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { reserved } from 'src/app/core/models/reservedWord';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tpaListCols } from 'src/app/shared/app/grid/tpaListCols';
import { TpaListService } from 'src/app/shared/services/master-tables/claims/tpa-list.service';
import { ITpaList, ITpaListData } from 'src/app/shared/app/models/MasterTables/claims/i-tpa-list';

@Component({
  selector: 'app-tpa-list',
  templateUrl: './tpa-list.component.html',
  styleUrls: [ './tpa-list.component.scss' ]
})
export class TpaListComponent implements OnInit, OnDestroy
{

  TpaListFormSubmitted = false as boolean;
  TpaListModal!: NgbModalRef;
  TpaListForm!: FormGroup<ITpaList>;
  @ViewChild("TpaListContent") TpaListContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as ITpaList[],
    totalPages: 0,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi> {};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: tpaListCols,
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
    private TpaListService: TpaListService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) { }

  ngOnInit (): void
  {
    this.initTpaListForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();
      let sub = this.TpaListService.getTpaList().subscribe(
        (res: HttpResponse<IBaseResponse<ITpaList[]>>) =>
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

  openTpaListDialoge ()
  {
    this.resetTpaListForm();
    this.TpaListModal = this.modalService.open(this.TpaListContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });

    this.TpaListModal.hidden.subscribe(() =>
    {
      this.resetTpaListForm();
      this.TpaListFormSubmitted = false;
    });
  }

  initTpaListForm ()
  {
    this.TpaListForm = new FormGroup<ITpaList>({
      sno: new FormControl(null),
      tpaName: new FormControl(null, Validators.required),
    })
  }

  get f ()
  {
    return this.TpaListForm.controls;
  }

  fillAddTpaListForm (data: ITpaListData)
  {
    this.f.tpaName?.patchValue(data.tpaName!);
  }

  validationChecker (): boolean
  {
    if (this.TpaListForm.invalid)
    {
      this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
      return false;
    }
    return true;
  }

  submitTpaListData (form: FormGroup)
  {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: ITpaListData = {
      tpaName: formData.tpaName,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.TpaListService.saveTpaList(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) =>
      {
        this.TpaListModal.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetTpaListForm();
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

  resetTpaListForm ()
  {
    this.TpaListForm.reset();
  }

  DeleteTpaList (sno: number)
  {
    let sub = this.TpaListService.DeleteTpaList(sno).subscribe(
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