import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup } from "@angular/forms";
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
  NgbModal,
  NgbModalRef,
  NgbOffcanvas,
} from "@ng-bootstrap/ng-bootstrap";

import { clientManageCols } from "src/app/shared/app/grid/clientCols";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { ClientsService } from "src/app/shared/services/clients/clients.service";
import { IClient } from "src/app/shared/app/models/Clients/iclient";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IClientFilters } from "src/app/shared/app/models/Clients/iclientFilters";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { ClientsPermissions } from "src/app/core/roles/clients-permissions";
import { Roles } from "src/app/core/roles/Roles";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { ClientPreviewComponent } from "src/app/shared/components/client-preview/client-preview.component";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { IClientPreview } from "src/app/shared/app/models/Clients/iclient-preview";
// import { ClientPreviewComponent } from "src/app/shared/components/client-preview/client-preview.component";

@Component({
  selector: "app-client-registry-list",
  templateUrl: "./client-registry-list.component.html",
  styleUrls: ["./client-registry-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ClientRegistryListComponent implements OnInit, OnDestroy {
  @ViewChild("filter") clintFilter!: ElementRef;
  modalRef!: NgbModalRef;
  uiState = {
    routerLink: { forms: AppRoutes.Client.clientForms },
    gridReady: false,
    submitted: false,
    filters: {
      pageNumber: 1,
      pageSize: 50,
      orderBy: "sNo",
      orderDir: "asc",
    } as IClientFilters,
    clients: {
      list: [] as IClient[],
      totalPages: 0,
    },
    privileges: ClientsPermissions,
  };

  permissions$!: Observable<string[]>;

  // filter form
  filterForm!: FormGroup;
  lookupData!: Observable<IBaseMasterTable>;
  // to unSubscribe
  subscribes: Subscription[] = [];
  // Grid Definitions
  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    pagination: true,
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: clientManageCols,
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

  constructor(
    private clientService: ClientsService,
    private message: MessagesService,
    private offcanvasService: NgbOffcanvas,
    private table: MasterTableService,
    private router: Router,
    private permission: PermissionsService,
    private modalService: NgbModal,
    private auth: AuthenticationService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.permissions$ = this.permission.getPrivileges(Roles.Clients);

    this.initFilterForm();
    this.getLookupData();
    let sub = this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        if (!evt.url.includes("details")) {
          if (this.router.getCurrentNavigation()?.extras.state!["updated"])
            this.gridApi.setDatasource(this.dataSource);
        }
      }
    });
    let sub2 = this.permissions$.subscribe((res: string[]) => {
      if (!res.includes(this.uiState.privileges.ChAccessAllProducersClients))
        this.filterForm.controls["producer"].patchValue(
          this.auth.getUser().name
        );
    });
    let sub3 = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.modalService.hasOpenModals() ? this.modalRef.close() : "";
      }
    });
    this.subscribes.push(sub, sub2, sub3);
  }

  // Table Section
  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();

      let sub = this.clientService
        .getAllClients(this.uiState.filters)
        .subscribe(
          (res: HttpResponse<IBaseResponse<IClient[]>>) => {
            this.uiState.clients.totalPages = JSON.parse(
              res.headers.get("x-pagination")!
            ).TotalCount;

            this.uiState.clients.list = res.body?.data!;

            params.successCallback(
              this.uiState.clients.list,
              this.uiState.clients.totalPages
            );
            this.uiState.gridReady = true;
            this.gridApi.hideOverlay();
          },
          (err: HttpErrorResponse) => {
            this.message.popup("Oops!", err.message, "error");
            this.gridApi.hideOverlay();
          }
        );
      this.subscribes.push(sub);
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
    this.gridApi.sizeColumnsToFit();
  }

  //  filter Section
  openFilterOffcanvas(): void {
    this.offcanvasService.open(this.clintFilter, { position: "end" });
  }
  private initFilterForm(): void {
    this.filterForm = new FormGroup({
      fullName: new FormControl(""),
      type: new FormControl(""),
      branch: new FormControl(""),
      producer: new FormControl(""),
      commericalNo: new FormControl(""),
      status: new FormControl([]),
    });
  }
  getLookupData() {
    this.lookupData = this.table.getBaseData(MODULES.Client);
  }
  modifyFilterReq() {
    this.uiState.filters = {
      ...this.uiState.filters,
      ...this.filterForm.value,
    };
  }

  openClientPreview(id: string) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.clientService
      .getClintDetails(id)
      .subscribe((res: HttpResponse<IBaseResponse<IClientPreview>>) => {
        if (res.status) {
          this.modalRef = this.modalService.open(ClientPreviewComponent, {
            fullscreen: true,
            scrollable: true,
          });
          this.modalRef.componentInstance.data = {
            id,
            clientDetails: res.body?.data!,
          };
          this.eventService.broadcast(reserved.isLoading, false);
        } else this.message.popup("Oops!", res.body?.message!, "error");
      });
    this.subscribes.push(sub);
  }

  onClientFilters(): void {
    this.modifyFilterReq();
    this.gridApi.setDatasource(this.dataSource);
  }

  clearFilter() {
    this.filterForm.reset();
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
