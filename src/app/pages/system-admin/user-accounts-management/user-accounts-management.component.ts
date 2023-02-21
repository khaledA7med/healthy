import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { Observable, Subscription } from "rxjs";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";

import PerfectScrollbar from "perfect-scrollbar";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import AppUtils from "src/app/shared/app/util";
import { ISystemAdminFilters } from "src/app/shared/app/models/SystemAdmin/isystem-admin-filters";
import { ISystemAdmin } from "src/app/shared/app/models/SystemAdmin/isystem-admin";
import { systemAdminCols } from "src/app/shared/app/grid/systemAdminCols";
import { SystemAdminService } from "src/app/shared/services/system-admin/system-admin.service";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";


@Component({
  selector: 'app-user-accounts-management',
  templateUrl: './user-accounts-management.component.html',
  styleUrls: [ './user-accounts-management.component.scss' ],
  providers: [ AppUtils ],
  encapsulation: ViewEncapsulation.None,
})
export class UserAccountsManagementComponent implements OnInit, OnDestroy
{
  userId!: string;

  uiState = {
    routerLink: {
      forms: AppRoutes.SystemAdmin.create,
    },
    filters: {
      pageNumber: 1,
      pageSize: 50,
      orderBy: "sno",
      orderDir: "asc"
    } as ISystemAdminFilters,
    gridReady: false,
    submitted: false,
    admins: {
      list: [] as ISystemAdmin[],
      totalPages: 0,
    },
    filterByAmount: false,
  };

  filterForm!: FormGroup;
  lookupData!: Observable<IBaseMasterTable>;
  @ViewChild("filter") policiesFilter!: ElementRef;


  subscribes: Subscription[] = [];
  gridApi: GridApi = <GridApi> {};
  gridOpts: GridOptions = {
    pagination: true,
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: systemAdminCols,
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
    private systemAdminService: SystemAdminService,
    private masterService: MasterMethodsService,
    private tableRef: ElementRef,
    private message: MessagesService,
    private offcanvasService: NgbOffcanvas,
    private table: MasterTableService,
    private appUtils: AppUtils,
  ) { }

  ngOnInit (): void
  {
    this.initFilterForm();
    this.getLookupData();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();
      let sub = this.systemAdminService.getAllAdmins(this.uiState.filters).subscribe(
        (res: HttpResponse<IBaseResponse<ISystemAdmin[]>>) =>
        {
          this.uiState.admins.totalPages = JSON.parse(res.headers.get("x-pagination")!).TotalCount;

          this.uiState.admins.list = res.body?.data!;
          params.successCallback(this.uiState.admins.list, this.uiState.admins.totalPages);
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
    if ((this, this.uiState.admins.list.length > 0)) this.gridApi.sizeColumnsToFit();
  }

  //#region Filter INIT and Functions
  openSysyemAdminFilter ()
  {
    this.offcanvasService.open(this.policiesFilter, { position: "end" });
  }

  private initFilterForm (): void
  {
    this.filterForm = new FormGroup({
      fullName: new FormControl(""),
      branch: new FormControl(""),
      jobTitle: new FormControl(""),
      status: new FormControl([])
    });
  }

  get f ()
  {
    return this.filterForm.controls;
  }

  getLookupData ()
  {
    this.lookupData = this.table.getBaseData(MODULES.SystemAdmin);
  }

  modifyFilterReq ()
  {
    this.uiState.filters = {
      ...this.uiState.filters,
      ...this.filterForm.value,
    };
  }

  onSystemAdminFilter (): void
  {
    this.modifyFilterReq();
    this.gridApi.setDatasource(this.dataSource);
  }

  clearFilter ()
  {
    this.filterForm.reset();
  }
  //#endregion

  ResetPassword ()
  {
    let sub = this.systemAdminService.getResetPassword(this.userId).subscribe(
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
