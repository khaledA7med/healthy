import { HttpResponse } from "@angular/common/http";
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import {
  NgbModal,
  NgbModalRef,
  NgbOffcanvas,
} from "@ng-bootstrap/ng-bootstrap";
import {
  CellEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { Observable, Subscription } from "rxjs";
import {
  IBaseMasterTable,
  IGenericResponseType,
} from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { Roles } from "src/app/core/roles/Roles";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { medicalActiveListCols } from "src/app/shared/app/grid/medicalActiveListCols";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IMedicalActiveList } from "src/app/shared/app/models/Production/i-medical-active-list";
import {
  IMedicalActiveFilters,
  IMedicalActiveFiltersForm,
} from "src/app/shared/app/models/Production/i-medical-active-list-filter";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import AppUtils from "src/app/shared/app/util";
import { MedicalActivePreviewComponent } from "src/app/shared/components/medical-active-preview/medical-active-preview/medical-active-preview.component";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";

@Component({
  selector: "app-medical-active-list",
  templateUrl: "./medical-active-list.component.html",
  styleUrls: ["./medical-active-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class MedicalActiveListComponent implements OnInit, OnDestroy {
  uiState = {
    filters: {
      pageNumber: 1,
      pageSize: 50,
      orderBy: "sNo",
      orderDir: "asc",
    } as IMedicalActiveFilters,
    gridReady: false,
    submitted: false,
    policies: {
      list: [] as IMedicalActiveList[],
      totalPages: 0,
    },
    filterByAmount: false,
  };

  filterForm!: FormGroup<IMedicalActiveFiltersForm>;
  lookupData!: Observable<IBaseMasterTable>;
  @ViewChild("filter") medicalActiveFilter!: ElementRef;
  modalRef!: NgbModalRef;

  subscribes: Subscription[] = [];
  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    pagination: true,
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: medicalActiveListCols,
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
    overlayNoRowsTemplate:
      "<alert class='alert alert-secondary'>No Data To Show</alert>",
    onGridReady: (e) => this.onGridReady(e),
    onCellClicked: (e) => this.onCellClicked(e),
    onSortChanged: (e) => this.onSort(e),
    onPaginationChanged: (e) => this.onPageChange(e),
  };

  constructor(
    private productionService: ProductionService,
    private message: MessagesService,
    private offcanvasService: NgbOffcanvas,
    private table: MasterTableService,
    private appUtils: AppUtils,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
    this.getLookupData();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      // let sub = this.productionService.getAllPolicies(this.uiState.filters).subscribe((res: HttpResponse<IBaseResponse<IPolicy[]>>) => {
      // 	if (res.status) {
      // 		this.uiState.policies.totalPages = JSON.parse(res.headers.get("x-pagination")!).TotalCount;
      // 		this.uiState.policies.list = res.body?.data!;
      // 		params.successCallback(this.uiState.policies.list, this.uiState.policies.totalPages);
      // 		if (this.uiState.policies.list.length === 0) this.gridApi.showNoRowsOverlay();
      // 		this.uiState.gridReady = true;
      // 		this.gridApi.hideOverlay();
      // 	} else {
      // 		this.message.popup("Oops!", res.body?.message!, "warning");
      // 		this.gridApi.hideOverlay();
      // 	}
      // });
      // this.subscribes.push(sub);
    },
  };

  onSort(e: GridReadyEvent) {
    let colState = e.columnApi.getColumnState();
    colState.forEach((el) => {
      if (el.sort) {
        this.uiState.filters.orderBy = el.colId!;
        this.uiState.filters.orderDir = el.sort!;
      }
    });
  }

  onCellClicked(params: CellEvent) {
    if (params.column.getColId() == "action") {
      params.api.getCellRendererInstances({
        rowNodes: [params.node],
        columns: [params.column],
      });
    }
  }

  onPageSizeChange() {
    this.gridApi.paginationSetPageSize(+this.uiState.filters.pageSize);
    this.gridOpts.cacheBlockSize = +this.uiState.filters.pageSize;
    this.gridApi.showLoadingOverlay();
    this.gridApi.setDatasource(this.dataSource);
  }

  onPageChange(params: GridReadyEvent) {
    if (this.uiState.gridReady) {
      this.uiState.filters.pageNumber =
        this.gridApi.paginationGetCurrentPage() + 1;
    }
  }

  onGridReady(param: GridReadyEvent) {
    this.gridApi = param.api;
    this.gridApi.setDatasource(this.dataSource);
    if ((this, this.uiState.policies.list.length > 0))
      this.gridApi.sizeColumnsToFit();
  }

  openMedicalActiveFilter() {
    this.offcanvasService.open(this.medicalActiveFilter, { position: "end" });
  }

  private initFilterForm(): void {
    this.filterForm = new FormGroup<IMedicalActiveFiltersForm>({
      // status: new FormControl(["Active"], Validators.required),
      // branch: new FormControl(""),
    });
  }

  get f() {
    return this.filterForm.controls;
  }

  getLookupData() {
    this.lookupData = this.table.getBaseData(MODULES.Production);
  }

  modifyFilterReq() {
    this.uiState.filters = {
      ...this.uiState.filters,
      ...this.filterForm.value,
    };
  }

  openMedicalActivePreview(id: string) {
    this.modalRef = this.modalService.open(MedicalActivePreviewComponent, {
      fullscreen: true,
      scrollable: true,
    });
    this.modalRef.componentInstance.data = {
      id,
    };
  }

  onMedicalActiveFilters(): void {
    this.modifyFilterReq();
    this.gridApi.setDatasource(this.dataSource);
  }

  clearFilter() {
    this.filterForm.reset();
  }
  //#endregion

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
