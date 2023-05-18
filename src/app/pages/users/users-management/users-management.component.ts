import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
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

import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import {
  IUsersFiltersForm,
  IUsersFilters,
} from "src/app/shared/app/models/Users/iusersFilters";
import { IUsers } from "src/app/shared/app/models/Users/iusers";
import { UsersCols } from "src/app/shared/app/grid/usersListCols";
import { UsersService } from "src/app/shared/services/users/users.service";
import { EventService } from "src/app/core/services/event.service";
import {
  IUsersData,
  IUsersForm,
} from "src/app/shared/app/models/Users/iusersForm";
import { reserved } from "src/app/core/models/reservedWord";
import { UsersStatus } from "src/app/shared/app/models/Users/users-utils";

@Component({
  selector: "app-users-management",
  templateUrl: "./users-management.component.html",
  styleUrls: ["./users-management.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UsersManagementComponent implements OnInit, OnDestroy {
  uiState = {
    // routerLink: {
    // 	forms: AppRoutes.SystemAdmin.create,
    // 	privileges: AppRoutes.SystemAdmin.privileges,
    // },
    filters: {
      pageNumber: 1,
      pageSize: 50,
      orderBy: "sno",
      orderDir: "asc",
    } as IUsersFilters,
    gridReady: false,
    submitted: false,
    users: {
      list: [] as IUsers[],
      totalPages: 0,
    },
    filterByAmount: false as Boolean,
    editUserMode: false as Boolean,
    // editUserData: {} as UserModelData,
  };
  userModal!: NgbModalRef;
  userForm!: FormGroup<IUsersForm>;
  userFormSubmitted = false as boolean;

  filterForm!: FormGroup<IUsersFiltersForm>;
  @ViewChild("filter") usersFilter!: ElementRef;
  @ViewChild("usersContent") usersContent!: TemplateRef<any>;

  subscribes: Subscription[] = [];
  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    pagination: true,
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: UsersCols,
    suppressCsvExport: true,
    paginationPageSize: this.uiState.filters.pageSize,
    cacheBlockSize: this.uiState.filters.pageSize,
    context: { comp: this },
    rowSelection: "single",
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
    private UsersService: UsersService,
    private message: MessagesService,
    private offcanvasService: NgbOffcanvas,
    private table: MasterTableService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
    this.initUserForm();
    // this.getLookupData();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.UsersService.getAllUsers(this.uiState.filters).subscribe(
        (res: HttpResponse<IBaseResponse<IUsers[]>>) => {
          if (res.body?.status) {
            this.uiState.users.totalPages = JSON.parse(
              res.headers.get("x-pagination")!
            ).TotalCount;

            this.uiState.users.list = res.body?.data!;
            params.successCallback(
              this.uiState.users.list,
              this.uiState.users.totalPages
            );
          } else this.message.popup("Oops!", res.body?.message!, "error");
          this.uiState.gridReady = true;
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

  //#region Filter INIT and Functions
  openUsersFilter() {
    this.offcanvasService.open(this.usersFilter, { position: "end" });
  }

  private initFilterForm(): void {
    this.filterForm = new FormGroup<IUsersFiltersForm>({
      status: new FormControl(null),
      userType: new FormControl(null),
      clientName: new FormControl(null),
    });
  }

  get f() {
    return this.filterForm.controls;
  }

  modifyFilterReq() {
    this.uiState.filters = {
      ...this.uiState.filters,
      ...this.filterForm.value,
    };
  }

  onUsersFilter(): void {
    this.modifyFilterReq();
    this.gridApi.setDatasource(this.dataSource);
  }

  clearFilter() {
    this.filterForm.reset();
  }
  //#endregion

  initUserForm() {
    this.userForm = new FormGroup<IUsersForm>({
      firstName: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  get ff() {
    return this.userForm.controls;
  }

  // get usersControlArray(): FormArray {
  //   return this.userForm.get("users") as FormArray;
  // }

  // addUser(data?: IAddUser): void {
  //   if (this.f.users?.invalid) {
  //     this.f.users?.markAllAsTouched();
  //     return;
  //   }
  //   let user = new FormGroup<IAddUser>({
  //     firstName: new FormControl(
  //       data?.firstName || null,
  //       Validators.required
  //     ),
  //     surname: new FormControl(data?.surname || null),
  //     email: new FormControl(data?.email || null, [
  //       Validators.required,
  //       Validators.email,
  //     ])
  //   });

  //   if (!data) user.reset();
  //   else user.disable();

  //   this.f.users?.push(user);
  //   this.usersControlArray.updateValueAndValidity();
  // }

  // remove(i: number, type: string) {
  //   if (type === "user") this.userCsontrolArray.removeAt(i);
  //   else return;
  // }

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
    });
  }

  fillAddUserForm(data: IUsersData) {
    this.ff.firstName?.patchValue(data.firstName!);
    this.ff.surname?.patchValue(data.surname!);
    this.ff.email?.patchValue(data.email!);
  }

  validationChecker(): boolean {
    console.log(this.userForm);
    if (this.userForm.invalid) {
      return false;
    }
    return true;
  }

  submitUser(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IUsersData = {
      firstName: formData.firstName,
      surname: formData.surname,
      email: formData.email,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.UsersService.saveUser(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.userModal.dismiss();
          this.uiState.submitted = false;
          this.resetUserForm();
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res.body?.message!, "success");
        } else this.message.popup("Oops!", res.body?.message!, "error");
        this.eventService.broadcast(reserved.isLoading, false);
      }
    );
    this.subscribes.push(sub);
  }

  resetUserForm() {
    this.userForm.reset();
  }

  ResetPassword(email: string) {
    let sub = this.UsersService.getResetPassword(email).subscribe(
      (res: HttpResponse<IBaseResponse<any>>) => {
        this.gridApi.setDatasource(this.dataSource);
        if (res.body?.status) this.message.toast(res.body!.message!, "success");
        else this.message.toast(res.body!.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  changeStatus(user: IUsers, status: string): void {
    let dataSubmit = {
      sno: user.sno!,
      status: "",
    };
    switch (status) {
      case "active":
        dataSubmit.status = UsersStatus.Active;
        break;
      case "disable":
        dataSubmit.status = UsersStatus.Disabled;
        break;
      default:
        dataSubmit.status = status;
        break;
    }
    let sub = this.UsersService.changeStatus(dataSubmit).subscribe(
      (res: HttpResponse<IBaseResponse<any>>) => {
        this.gridApi.setDatasource(this.dataSource);
        if (res.body?.status) this.message.toast(res.body!.message!, "success");
        else this.message.toast(res.body!.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
