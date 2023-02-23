import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
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
import { SystemAdminStatus } from "src/app/shared/app/models/SystemAdmin/system-admin-utils";
import { EventService } from "src/app/core/services/event.service";
import {
  UserModel,
  UserModelData,
} from "src/app/shared/app/models/SystemAdmin/isystem-admin-user-form";
import { UserDetails } from "src/app/shared/app/models/SystemAdmin/system-admin-utils";
import { reserved } from "src/app/core/models/reservedWord";

@Component({
  selector: "app-user-accounts-management",
  templateUrl: "./user-accounts-management.component.html",
  styleUrls: ["./user-accounts-management.component.scss"],
  providers: [AppUtils],
  encapsulation: ViewEncapsulation.None,
})
export class UserAccountsManagementComponent implements OnInit, OnDestroy {
  uiState = {
    routerLink: {
      forms: AppRoutes.SystemAdmin.create,
      privileges: AppRoutes.SystemAdmin.privileges,
    },
    filters: {
      pageNumber: 1,
      pageSize: 50,
      orderBy: "sno",
      orderDir: "asc",
    } as ISystemAdminFilters,
    gridReady: false,
    submitted: false,
    admins: {
      list: [] as ISystemAdmin[],
      totalPages: 0,
    },
    filterByAmount: false as Boolean,
    editUserMode: false as Boolean,
    editUserData: {} as UserModelData,
  };

  filterForm!: FormGroup;
  lookupData!: Observable<IBaseMasterTable>;

  @ViewChild("filter") policiesFilter!: ElementRef;
  @ViewChild("usersContent") usersContent!: TemplateRef<any>;

  subscribes: Subscription[] = [];
  gridApi: GridApi = <GridApi>{};
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

  constructor(
    private systemAdminService: SystemAdminService,
    private tableRef: ElementRef,
    private message: MessagesService,
    private offcanvasService: NgbOffcanvas,
    private table: MasterTableService,
    private appUtils: AppUtils,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
    this.initUserForm();
    this.getLookupData();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.systemAdminService
        .getAllAdmins(this.uiState.filters)
        .subscribe(
          (res: HttpResponse<IBaseResponse<ISystemAdmin[]>>) => {
            this.uiState.admins.totalPages = JSON.parse(
              res.headers.get("x-pagination")!
            ).TotalCount;

            this.uiState.admins.list = res.body?.data!;
            params.successCallback(
              this.uiState.admins.list,
              this.uiState.admins.totalPages
            );
            this.uiState.gridReady = true;
            this.gridApi.hideOverlay();
          },
          (err: HttpErrorResponse) => {
            this.message.popup("Oops!", err.message, "error");
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
    // this.gridApi.sizeColumnsToFit();

    const agBodyHorizontalViewport: HTMLElement =
      this.tableRef.nativeElement.querySelector(
        "#gridScrollbar .ag-body-horizontal-scroll-viewport"
      );
    const agBodyViewport: HTMLElement =
      this.tableRef.nativeElement.querySelector(
        "#gridScrollbar .ag-body-viewport"
      );

    if (agBodyViewport) {
      const vertical = new PerfectScrollbar(agBodyViewport);
      vertical.update();
    }
    if (agBodyHorizontalViewport) {
      const horizontal = new PerfectScrollbar(agBodyHorizontalViewport);
      horizontal.update();
    }
    if ((this, this.uiState.admins.list.length > 0))
      this.gridApi.sizeColumnsToFit();
  }

  //#region Filter INIT and Functions
  openSysyemAdminFilter() {
    this.offcanvasService.open(this.policiesFilter, { position: "end" });
  }

  private initFilterForm(): void {
    this.filterForm = new FormGroup({
      fullName: new FormControl(""),
      branch: new FormControl(""),
      jobTitle: new FormControl(""),
      status: new FormControl([]),
    });
  }

  get f() {
    return this.filterForm.controls;
  }

  getLookupData() {
    this.lookupData = this.table.getBaseData(MODULES.SystemAdmin);
  }

  modifyFilterReq() {
    this.uiState.filters = {
      ...this.uiState.filters,
      ...this.filterForm.value,
    };
  }

  onSystemAdminFilter(): void {
    this.modifyFilterReq();
    this.gridApi.setDatasource(this.dataSource);
  }

  clearFilter() {
    this.filterForm.reset();
  }
  //#endregion

  ResetPassword(id: any) {
    let sub = this.systemAdminService.getResetPassword(id).subscribe(
      (res: HttpResponse<IBaseResponse<any>>) => {
        this.gridApi.setDatasource(this.dataSource);
        if (res.body?.status) this.message.toast(res.body!.message!, "success");
        else this.message.toast(res.body!.message!, "error");
      },
      (err: HttpErrorResponse) => {
        this.message.popup("Oops!", err.message, "error");
      }
    );
    this.subscribes.push(sub);
  }

  changeStatus(user: ISystemAdmin, status: string): void {
    let dataSubmit = {
      sno: user.sno!,
      status: "",
    };
    switch (status) {
      case "active":
        dataSubmit.status = SystemAdminStatus.Active;
        break;
      case "disable":
        dataSubmit.status = SystemAdminStatus.Disable;
        break;
      default:
        dataSubmit.status = status;
        break;
    }
    let sub = this.systemAdminService.changeStatus(dataSubmit).subscribe(
      (res: HttpResponse<IBaseResponse<any>>) => {
        this.gridApi.setDatasource(this.dataSource);
        if (res.body?.status) this.message.toast(res.body!.message!, "success");
        else this.message.toast(res.body!.message!, "error");
      },
      (err: HttpErrorResponse) => {
        this.message.popup("Oops!", err.message, "error");
      }
    );
    this.subscribes.push(sub);
  }

  //#region Add/Edit User Modal

  userModal!: NgbModalRef;
  userForm!: FormGroup;
  userFormSubmitted = false as boolean;

  initUserForm() {
    this.userForm = new FormGroup<UserModel>({
      sno: new FormControl(null),
      staffId: new FormControl(null),
      fullName: new FormControl(null, Validators.required),
      userName: new FormControl(null, Validators.required),
      jobTitle: new FormControl(null, Validators.required),
      phoneNo: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      branch: new FormControl(null, Validators.required),
      pass: new FormControl(null),
      savedUser: new FormControl(null),
      savedDate: new FormControl(null),
      updateUser: new FormControl(null),
      updateDate: new FormControl(null),
      DDSecurityRole: new FormControl(null, Validators.required),
      securityRoles: new FormArray([], Validators.required),
    });
  }

  get ff() {
    return this.userForm.controls;
  }

  editUser(id: string) {
    let sub = this.systemAdminService.getEditUserData(id).subscribe(
      (res: HttpResponse<IBaseResponse<UserModelData>>) => {
        this.uiState.editUserMode = true;
        this.uiState.editUserData = res.body?.data!;
        this.openUsersDialoge();
        this.fillEditUserForm(res.body?.data!);
      },
      (err: HttpErrorResponse) => {
        this.message.popup("Oops!", err.message, "error");
      }
    );
    this.subscribes.push(sub);
  }

  openUsersDialoge() {
    this.resetUserForm();
    this.userModal = this.modalService.open(this.usersContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "xl",
    });

    this.userModal.hidden.subscribe(() => {
      this.resetUserForm();
      this.userFormSubmitted = false;
      this.uiState.editUserMode = false;
    });
  }

  get securityRolesArray() {
    return this.userForm.get("securityRoles") as FormArray;
  }

  securityRolesControls(i: number): AbstractControl {
    return this.securityRolesArray.controls[i];
  }

  addSecurityRole(value: string) {
    if (this.ff["DDSecurityRole"].valid || this.uiState.editUserMode) {
      let newVal = new FormControl();
      newVal.patchValue(value);
      let exitChecker = this.securityRolesArray.getRawValue() as Array<string>;
      if (!exitChecker.includes(value)) this.securityRolesArray.push(newVal);
      else this.message.popup("Oops!", "Security Role Already Added", "error");

      if (this.securityRolesArray.length > 0)
        this.ff["DDSecurityRole"].clearValidators();
      else this.ff["DDSecurityRole"].addValidators(Validators.required);
    } else {
      this.ff["DDSecurityRole"].markAsTouched();
    }
  }

  deleteSecurityRole(i: number) {
    this.securityRolesArray.removeAt(i);
  }

  getUserDetails(sno: number) {
    let sub = this.systemAdminService.getUserDetails(sno).subscribe(
      (res: HttpResponse<IBaseResponse<UserDetails>>) => {
        this.fillAddUserForm(res.body?.data!);
      },
      (err: HttpErrorResponse) => {
        this.message.popup("Oops!", err.message, "error");
      }
    );
    this.subscribes.push(sub);
  }

  fillAddUserForm(data: UserDetails) {
    this.ff["branch"].patchValue(data.branch);
    this.ff["email"].patchValue(data.email);
    this.ff["phoneNo"].patchValue(data.mobile);
    this.ff["branch"].patchValue(data.branch);
    this.ff["jobTitle"].patchValue(data.position);
  }

  fillEditUserForm(data: UserModelData) {
    this.ff["staffId"].patchValue(data.staffId);
    this.ff["fullName"].patchValue(data.fullName);
    this.ff["userName"].patchValue(data.userName);
    this.ff["branch"].patchValue(data.branch);
    this.ff["email"].patchValue(data.email);
    this.ff["phoneNo"].patchValue(data.phoneNo);
    this.ff["branch"].patchValue(data.branch);
    this.ff["jobTitle"].patchValue(data.jobTitle);
    this.ff["staffId"].disable();
    this.ff["fullName"].disable();
    this.ff["userName"].disable();
    this.ff["jobTitle"].disable();
    data.securityRoles?.forEach((sr: string) => this.addSecurityRole(sr));
  }

  validationChecker(): boolean {
    if (this.userForm.invalid) {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  submitUserData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: UserModelData = {
      sno: this.uiState.editUserMode ? this.uiState.editUserData.sno : 0,
      fullName: formData.fullName,
      userName: formData.userName,
      branch: formData.branch,
      jobTitle: formData.jobTitle,
      phoneNo: formData.phoneNo,
      email: formData.email,
      securityRoles: formData.securityRoles,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.systemAdminService.saveUser(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) => {
        this.userModal.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetUserForm();
        this.gridApi.setDatasource(this.dataSource);
        this.message.toast(res.body?.message!, "success");
      },
      (err: HttpErrorResponse) => {
        this.message.popup("Oops!", err.error.message, "error");
        this.eventService.broadcast(reserved.isLoading, false);
      }
    );
    this.subscribes.push(sub);
  }

  resetUserForm() {
    this.userForm.reset();
    this.securityRolesArray.clear();
  }

  //#endregion

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
