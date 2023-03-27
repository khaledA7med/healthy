import { IPolicyIssuanceRequirementsFilter } from "./../../../../../../shared/app/models/MasterTables/business-development/sales/i-policy-issuance-requirements";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  CellEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { EventService } from "src/app/core/services/event.service";
import { Observable, Subscription } from "rxjs";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { reserved } from "src/app/core/models/reservedWord";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MasterTableService } from "src/app/core/services/master-table.service";
import {
  Caching,
  IBaseMasterTable,
  IGenericResponseType,
} from "src/app/core/models/masterTableModels";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";
import { MODULES } from "src/app/core/models/MODULES";
import { policyIssuanceRequirementsCols } from "src/app/shared/app/grid/policyIssuanceRequirementsCols";
import {
  IPolicyIssuanceRequirements,
  IPolicyIssuanceRequirementsData,
} from "src/app/shared/app/models/MasterTables/business-development/sales/i-policy-issuance-requirements";
import { PolicyIssuanceRequirementsService } from "src/app/shared/services/master-tables/business-development/sales/policy-issuance-requirements.service";

@Component({
  selector: "app-policy-issuance-requirements",
  templateUrl: "./policy-issuance-requirements.component.html",
  styleUrls: ["./policy-issuance-requirements.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PolicyIssuanceRequirementsComponent implements OnInit, OnDestroy {
  lookupData!: Observable<IBaseMasterTable>;
  PolicyIssuanceRequirementsFormSubmitted = false as boolean;
  PolicyIssuanceRequirementsModal!: NgbModalRef;
  PolicyIssuanceRequirementsForm!: FormGroup<IPolicyIssuanceRequirements>;
  lineOfBussArr: IGenericResponseType[] = [];

  @ViewChild("PolicyIssuanceRequirementsContent")
  PolicyIssuanceRequirementsContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: {
      itemsList: [] as IPolicyIssuanceRequirementsFilter[],
    },
    totalPages: 0,
    editPolicyIssuanceRequirementsMode: false as Boolean,
    editPolicyIssuanceRequirementsData: {} as IPolicyIssuanceRequirementsData,
  };

  isChecked!: number;
  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: policyIssuanceRequirementsCols,
    suppressCsvExport: true,
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
  };

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      const data: {
        class: string;
        lineOfBusiness: string;
        insuranceCopmany: string;
      } = {
        class: this.f.class?.value!,
        lineOfBusiness: this.f.lineOfBusiness?.value!,
        insuranceCopmany: this.f.insuranceCopmany?.value!,
      };
      let sub =
        this.PolicyIssuanceRequirementsService.getPolicyIssuanceRequirements(
          data
        ).subscribe(
          (
            res: HttpResponse<
              IBaseResponse<IPolicyIssuanceRequirementsFilter[]>
            >
          ) => {
            if (res.body?.status) {
              this.uiState.list.itemsList = res.body?.data!;
              params.successCallback(
                this.uiState.list.itemsList,
                this.uiState.list.itemsList.length
              );
              if (this.uiState.list.itemsList.length === 0)
                this.gridApi.showNoRowsOverlay();
              else this.gridApi.hideOverlay();
            } else {
              this.uiState.gridReady = true;
              this.gridApi.hideOverlay();
            }
          }
        );
      this.subscribes.push(sub);
    },
  };

  onCellClicked(params: CellEvent) {
    if (params.column.getColId() == "action") {
      params.api.getCellRendererInstances({
        rowNodes: [params.node],
        columns: [params.column],
      });
    }
  }

  onPageSizeChange() {
    this.gridApi.showLoadingOverlay();
    this.gridApi.setDatasource(this.dataSource);
  }

  onGridReady(param: GridReadyEvent) {
    this.gridApi = param.api;
    this.gridApi.setDatasource(this.dataSource);
    this.gridApi.sizeColumnsToFit();
  }

  constructor(
    private masterService: MasterMethodsService,
    private PolicyIssuanceRequirementsService: PolicyIssuanceRequirementsService,
    private message: MessagesService,
    private table: MasterTableService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initPolicyIssuanceRequirementsForm();
    this.getLookupData();
  }

  getLookupData() {
    this.lookupData = this.table.getBaseData(
      MODULES.PolicyIssuanceRequirements
    );
  }

  getLineOfBusiness(className: string) {
    let sub = this.masterService
      .getLineOfBusiness(className)
      .subscribe(
        (res: HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>) => {
          if (res.body?.status) {
            this.lineOfBussArr = res.body?.data?.content!;
          } else this.message.toast(res.body!.message!, "error");
        }
      );
    this.subscribes.push(sub);
  }

  DeletePolicyIssuanceRequirements(id: string) {
    let sub =
      this.PolicyIssuanceRequirementsService.DeletePolicyIssuanceRequirements(
        id
      ).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
        this.gridApi.setDatasource(this.dataSource);
        if (res.body?.status) this.message.toast(res.body!.message!, "success");
        else this.message.toast(res.body!.message!, "error");
      });
    this.subscribes.push(sub);
  }

  getPolicyIssuanceRequirementsData(id: string) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub =
      this.PolicyIssuanceRequirementsService.getEditPolicyIssuanceRequirements(
        id
      ).subscribe((res: IBaseResponse<IPolicyIssuanceRequirementsData>) => {
        if (res?.status) {
          this.uiState.editPolicyIssuanceRequirementsMode = true;
          this.uiState.editPolicyIssuanceRequirementsData = res.data!;
          this.PolicyIssuanceRequirementsForm.patchValue({
            ...this.uiState.editPolicyIssuanceRequirementsData,
            defaultTick:
              this.uiState.editPolicyIssuanceRequirementsData.defaultTick === 1
                ? true
                : false,
          });
          this.f.class?.disable();
          this.f.lineOfBusiness?.disable();
          this.f.insuranceCopmany?.disable();
          this.openPolicyIssuanceRequirementsDialoge();
          this.eventService.broadcast(reserved.isLoading, false);
        } else this.message.toast(res.message!, "error");
      });
    this.subscribes.push(sub);
  }

  openPolicyIssuanceRequirementsDialoge() {
    this.PolicyIssuanceRequirementsModal = this.modalService.open(
      this.PolicyIssuanceRequirementsContent,
      {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        size: "lg",
      }
    );

    this.PolicyIssuanceRequirementsModal.hidden.subscribe(() => {
      this.f.item?.reset();
      this.f.itemArabic?.reset();
      this.f.description?.reset();
      this.f.descriptionArabic?.reset();
      this.f.defaultTick?.reset();
      this.f.class?.enable();
      this.f.lineOfBusiness?.enable();
      this.f.insuranceCopmany?.enable();
    });
  }

  initPolicyIssuanceRequirementsForm() {
    this.PolicyIssuanceRequirementsForm =
      new FormGroup<IPolicyIssuanceRequirements>({
        sNo: new FormControl(0),
        item: new FormControl(null, Validators.required),
        itemArabic: new FormControl(null, Validators.required),
        description: new FormControl(null),
        descriptionArabic: new FormControl(null),
        defaultTick: new FormControl(false),
        class: new FormControl(null, Validators.required),
        lineOfBusiness: new FormControl(null, Validators.required),
        insuranceCopmany: new FormControl(null, Validators.required),
      });
  }

  get f() {
    return this.PolicyIssuanceRequirementsForm.controls;
  }

  validationChecker(): boolean {
    if (this.PolicyIssuanceRequirementsForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  submitPolicyIssuanceRequirementsData(
    form: FormGroup<IPolicyIssuanceRequirements>
  ) {
    this.uiState.submitted = true;
    // const formData = form.getRawValue();
    const data: IPolicyIssuanceRequirementsData = {
      ...form.getRawValue(),
      defaultTick: form.getRawValue().defaultTick === true ? 1 : 0,
      sNo: this.uiState.editPolicyIssuanceRequirementsMode
        ? this.uiState.editPolicyIssuanceRequirementsData.sNo
        : 0,
    };

    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);

    let sub =
      this.PolicyIssuanceRequirementsService.savePolicyIssuanceRequirements(
        data
      ).subscribe((res: IBaseResponse<any>) => {
        if (res.status) {
          if (this.uiState.editPolicyIssuanceRequirementsMode) {
            this.PolicyIssuanceRequirementsModal.dismiss();
            this.eventService.broadcast(reserved.isLoading, false);
          } else {
            this.f.item?.reset();
            this.f.itemArabic?.reset();
            this.f.description?.reset();
            this.f.descriptionArabic?.reset();
            this.f.defaultTick?.reset();
          }
          this.message.toast(res.message!, "success");
          this.gridApi.setDatasource(this.dataSource);
        } else this.message.popup("Sorry!", res.message!, "warning");
        this.eventService.broadcast(reserved.isLoading, false);
      });
    this.subscribes.push(sub);
  }

  resetPolicyIssuanceRequirementsForm() {
    this.f.item?.reset();
    this.f.itemArabic?.reset();
    this.f.description?.reset();
    this.f.descriptionArabic?.reset();
    this.f.defaultTick?.reset();
    this.f.class?.enable();
    this.f.lineOfBusiness?.enable();
    this.f.insuranceCopmany?.enable();
    this.uiState.submitted = false;
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
