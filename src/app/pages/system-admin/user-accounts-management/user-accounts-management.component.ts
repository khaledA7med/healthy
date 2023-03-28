import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { Observable, Subscription } from "rxjs";
import { NgbModal, NgbModalRef, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { ISystemAdminFilters, ISystemAdminFiltersForm } from "src/app/shared/app/models/SystemAdmin/isystem-admin-filters";
import { ISystemAdmin } from "src/app/shared/app/models/SystemAdmin/isystem-admin";
import { systemAdminCols } from "src/app/shared/app/grid/systemAdminCols";
import { SystemAdminService } from "src/app/shared/services/system-admin/system-admin.service";
import { SystemAdminStatus } from "src/app/shared/app/models/SystemAdmin/system-admin-utils";
import { EventService } from "src/app/core/services/event.service";
import { UserModel, UserModelData } from "src/app/shared/app/models/SystemAdmin/isystem-admin-user-form";
import { UserDetails } from "src/app/shared/app/models/SystemAdmin/isystem-admin-user-details";
import { reserved } from "src/app/core/models/reservedWord";

@Component({
	selector: "app-user-accounts-management",
	templateUrl: "./user-accounts-management.component.html",
	styleUrls: ["./user-accounts-management.component.scss"],
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

	filterForm!: FormGroup<ISystemAdminFiltersForm>;
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
		private message: MessagesService,
		private offcanvasService: NgbOffcanvas,
		private table: MasterTableService,
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
			let sub = this.systemAdminService.getAllAdmins(this.uiState.filters).subscribe((res: HttpResponse<IBaseResponse<ISystemAdmin[]>>) => {
				if (res.body?.status) {
					this.uiState.admins.totalPages = JSON.parse(res.headers.get("x-pagination")!).TotalCount;

					this.uiState.admins.list = res.body?.data!;
					params.successCallback(this.uiState.admins.list, this.uiState.admins.totalPages);
				} else this.message.popup("Oops!", res.body?.message!, "error");
				this.uiState.gridReady = true;
				this.gridApi.hideOverlay();
			});
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
			this.uiState.filters.pageNumber = this.gridApi.paginationGetCurrentPage() + 1;
		}
	}

	onGridReady(param: GridReadyEvent) {
		this.gridApi = param.api;
		this.gridApi.setDatasource(this.dataSource);
		if ((this, this.uiState.admins.list.length > 0)) this.gridApi.sizeColumnsToFit();
	}

	//#region Filter INIT and Functions
	openSysyemAdminFilter() {
		this.offcanvasService.open(this.policiesFilter, { position: "end" });
	}

	private initFilterForm(): void {
		this.filterForm = new FormGroup<ISystemAdminFiltersForm>({
			fullName: new FormControl(null),
			branch: new FormControl(null),
			jobTitle: new FormControl(null),
			status: new FormControl(null),
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
		let sub = this.systemAdminService.getResetPassword(id).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
			this.gridApi.setDatasource(this.dataSource);
			if (res.body?.status) this.message.toast(res.body!.message!, "success");
			else this.message.toast(res.body!.message!, "error");
		});
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
		let sub = this.systemAdminService.changeStatus(dataSubmit).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
			this.gridApi.setDatasource(this.dataSource);
			if (res.body?.status) this.message.toast(res.body!.message!, "success");
			else this.message.toast(res.body!.message!, "error");
		});
		this.subscribes.push(sub);
	}

	//#region Add/Edit User Modal

	userModal!: NgbModalRef;
	userForm!: FormGroup<UserModel>;
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
			DDSecurityRole: new FormControl(""),
			securityRoles: new FormControl([], Validators.required),
		});
	}

	get ff() {
		return this.userForm.controls;
	}

	openUsersDialoge(id?: string) {
		this.resetUserForm();
		this.userModal = this.modalService.open(this.usersContent, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
			backdrop: "static",
			size: "xl",
		});
		if (id) {
			this.eventService.broadcast(reserved.isLoading, true);
			let sub = this.systemAdminService.getEditUserData(id).subscribe((res: HttpResponse<IBaseResponse<UserModelData>>) => {
				if (res.body?.status) {
					this.uiState.editUserMode = true;
					this.uiState.editUserData = res.body?.data!;
					this.fillEditUserForm(res.body?.data!);
				} else this.message.popup("Oops!", res.body?.message!, "error");
				this.eventService.broadcast(reserved.isLoading, false);
			});
			this.subscribes.push(sub);
		}

		this.userModal.hidden.subscribe(() => {
			this.resetUserForm();
			this.userFormSubmitted = false;
			this.uiState.editUserMode = false;
		});
	}

	getUserDetails(sno: number) {
		let sub = this.systemAdminService.getUserDetails(sno).subscribe((res: HttpResponse<IBaseResponse<UserDetails>>) => {
			if (res.body?.status) this.fillAddUserForm(res.body?.data!);
			else this.message.popup("Oops!", res.body?.message!, "error");
		});
		this.subscribes.push(sub);
	}

	fillAddUserForm(data: UserDetails) {
		this.ff.branch?.patchValue(data.branch!);
		this.ff.email?.patchValue(data.email!);
		this.ff.phoneNo?.patchValue(data.mobile!);
		this.ff.jobTitle?.patchValue(data.position!);
	}

	fillEditUserForm(data: UserModelData) {
		this.ff.sno?.patchValue(data.sno!);
		this.ff.staffId?.patchValue(data.staffId!);
		this.ff.fullName?.patchValue(data.fullName!);
		this.ff.userName?.patchValue(data.userName!);
		this.ff.branch?.patchValue(data.branch!);
		this.ff.email?.patchValue(data.email!);
		this.ff.phoneNo?.patchValue(data.phoneNo!);
		this.ff.branch?.patchValue(data.branch!);
		this.ff.jobTitle?.patchValue(data.jobTitle!);
		this.ff.securityRoles?.patchValue(data.securityRoles!);
		this.ff.staffId?.disable();
		this.ff.fullName?.disable();
		this.ff.userName?.disable();
		this.ff.jobTitle?.disable();
	}

	validationChecker(): boolean {
		console.log(this.userForm);
		if (this.userForm.invalid) {
			if (this.userForm.value.securityRoles?.length == 0) this.message.popup("Attention!", "Please Add At Least Security Role", "warning");
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
		let sub = this.systemAdminService.saveUser(data).subscribe((res: HttpResponse<IBaseResponse<number>>) => {
			if (res.body?.status) {
				this.userModal.dismiss();
				this.uiState.submitted = false;
				this.resetUserForm();
				this.gridApi.setDatasource(this.dataSource);
				this.message.toast(res.body?.message!, "success");
			} else this.message.popup("Oops!", res.body?.message!, "error");
			this.eventService.broadcast(reserved.isLoading, false);
		});
		this.subscribes.push(sub);
	}

	resetUserForm() {
		this.userForm.reset();
		// this.securityRolesArray.clear();
	}

	//#endregion

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
