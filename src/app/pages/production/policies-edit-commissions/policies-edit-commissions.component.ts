import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ProductionService } from 'src/app/shared/services/production/production.service';
import { NgbModal, NgbModalRef, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { FormControl, FormGroup } from '@angular/forms';
import { IBaseMasterTable } from 'src/app/core/models/masterTableModels';
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { productionEditCommissionCols } from 'src/app/shared/app/grid/productionEditCommissionsCols';
import AppUtils from 'src/app/shared/app/util';
import { IEditCommissions } from 'src/app/shared/app/models/Production/i-edit-commissions';
import { AppRoutes } from 'src/app/shared/app/routers/appRouters';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import PerfectScrollbar from 'perfect-scrollbar';
import { MasterTableService } from 'src/app/core/services/master-table.service';
import { MODULES } from 'src/app/core/models/MODULES';
import { IEditCommissionsFilter } from 'src/app/shared/app/models/Production/i-edit-commission-filter';


@Component({
  selector: 'app-policies-edit-commissions',
  templateUrl: './policies-edit-commissions.component.html',
  styleUrls: [ './policies-edit-commissions.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class PoliciesEditCommissionsComponent implements OnInit
{

  submitted = false;

  uiState = {
    routerLink: { forms: AppRoutes.Production.editCommissions },
    gridReady: false,
    submitted: false,
    filters: {
      pageNumber: 1,
      pageSize: 50,
      orderBy: "sNo",
      orderDir: "asc"
    } as IEditCommissionsFilter,
    editCommissions: {
      list: [] as IEditCommissions[],
      totalPages: 0,
    },
  }

  @ViewChild("filter") editCommissionFilter!: ElementRef;
  @ViewChild("edit") eidtModal!: ElementRef

  filterForms!: FormGroup;
  editForm!: FormGroup;
  lookupData!: Observable<IBaseMasterTable>;

  // to unSubscribe
  subscribes: Subscription[] = [];
  // Grid Definitions
  gridApi: GridApi = <GridApi> {};
  gridOpts: GridOptions = {
    pagination: true,
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: productionEditCommissionCols,
    suppressCsvExport: true,
    paginationPageSize: this.uiState.filters.pageSize,
    cacheBlockSize: this.uiState.filters.pageSize,
    context: { comp: this },
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
    },
    onGridReady: (e) => this.onGridReady(e),
    onCellClicked: (e) => this.onCellClicked(e),
    onSortChanged: (e) => this.onSort(e),
    onPaginationChanged: (e) => this.onPageChange(e),
  };



  constructor (
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private message: MessagesService,
    private productionService: ProductionService,
    private appUtils: AppUtils,
    private tableRef: ElementRef,
    private offcanvasService: NgbOffcanvas,
    private table: MasterTableService,

  ) { }

  ngOnInit (): void
  {
    this.initFilterForm();
    this.getLookupData();
  }

  // Table Section
  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();

      let sub = this.productionService.getEditCommission(this.uiState.filters).subscribe(
        (res: HttpResponse<IBaseResponse<IEditCommissions[]>>) =>
        {
          this.uiState.editCommissions.totalPages = JSON.parse(res.headers.get("x-pagination")!);

          this.uiState.editCommissions.list = res.body?.data!;

          params.successCallback(this.uiState.editCommissions.list, this.uiState.editCommissions.totalPages);
          this.uiState.gridReady = true;
          this.gridApi.hideOverlay();
        },
        (err: HttpErrorResponse) =>
        {
          this.message.popup("Oops!", err.message, "error");
          this.gridApi.hideOverlay();
        }
      );
      this.subscribes.push(sub);
    },
  };

  onSort (e: GridReadyEvent)
  {
    let colState = e.columnApi.getColumnState();
    colState.forEach((el) =>
    {
      if (el.sort)
      {
        this.uiState.filters.orderBy = el.colId!;
        this.uiState.filters.orderDir = el.sort!;
      }
    });
  }

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
    this.gridApi.paginationSetPageSize(+this.uiState.filters.pageSize);
    this.gridOpts.cacheBlockSize = +this.uiState.filters.pageSize;
    this.gridApi.showLoadingOverlay();
    this.gridApi.setDatasource(this.dataSource);
  }

  onPageChange (params: GridReadyEvent)
  {
    if (this.uiState.gridReady)
    {
      this.uiState.filters.pageNumber = this.gridApi.paginationGetCurrentPage() + 1;
    }
  }

  onGridReady (param: GridReadyEvent)
  {
    this.gridApi = param.api;
    this.gridApi.setDatasource(this.dataSource);
    this.gridApi.sizeColumnsToFit();

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
  }

  //#region filter Section
  openFilterOffcanvas (): void
  {
    this.offcanvasService.open(this.editCommissionFilter, { position: "end" });
  }

  private initFilterForm (): void
  {
    this.filterForms = new FormGroup({
      clientName: new FormControl(null),
      policyNumber: new FormControl(null),
      producer: new FormControl(null),
    });
  }

  get f ()
  {
    return this.filterForms.controls;
  }

  getLookupData ()
  {
    this.lookupData = this.table.getBaseData(MODULES.Production);
  }

  modifyFilterReq ()
  {
    this.uiState.filters = {
      ...this.uiState.filters,
      ...this.filterForms.value,
    };
  }

  onEditCommissionsFilter (): void
  {
    this.modifyFilterReq();
    this.gridApi.setDatasource(this.dataSource);
  }

  clearFilter ()
  {
    this.filterForms.reset();
  }
  //#endregion

  openEditForm (id: string): void
  {
    let sub = this.modalService.open(this.eidtModal, { size: "xl" });
    sub.dismissed.subscribe(() =>
    {
      // this.followUpForm.reset();
      // this.followUpForm.markAsUntouched();
      // this.uiState.submitted = false;
    });
    // this.uiState.submitted = false;
    // this.loadFollowUpData(requestNo);
  }

  ngOnDestroy (): void
  {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }

}
