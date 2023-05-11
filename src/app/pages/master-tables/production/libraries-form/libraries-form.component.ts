import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import {
  Caching,
  IBaseMasterTable,
  IGenericResponseType,
} from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import {
  ILibrariesForm,
  ILibrariesReq,
} from "src/app/shared/app/models/MasterTables/production/i-libraries-form";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";
import {
  CellEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { MasterTableProductionService } from "src/app/shared/services/master-tables/production/production.service";
import { masterTableLibrariesCols } from "src/app/shared/app/grid/masterTableLibrariesCols";
import { ILibrariesFilter } from "src/app/shared/app/models/MasterTables/production/i-libraries-filter";

@Component({
  selector: "app-libraries-form",
  templateUrl: "./libraries-form.component.html",
  styleUrls: ["./libraries-form.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LibrariesFormComponent implements OnInit, OnDestroy {
  @Input() searchURI!: string;
  @Input() saveURI!: string;
  @Input() editURI!: string;
  @Input() deleteURI!: string;
  @ViewChild("editDialoge") EditItemDialoge!: TemplateRef<any>;
  formGroup!: FormGroup<ILibrariesForm>;
  submitted: boolean = false;
  lookupData!: Observable<IBaseMasterTable>;

  subscribes: Subscription[] = [];
  uiState = {
    isLoading: false as boolean,
    submitted: false as Boolean,
    gridReady: false as Boolean,
    lists: {
      itemsList: [] as ILibrariesFilter[],
      linesOfBusiness: [] as IGenericResponseType[],
    },
    editItemData: {} as ILibrariesReq,
    editMode: false as Boolean,
  };
  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    rowSelection: "single",
    columnDefs: masterTableLibrariesCols,
    suppressCsvExport: true,
    context: { comp: this },
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
    },
    overlayNoRowsTemplate:
      "<alert class='alert alert-secondary'>No data to show</alert>",
    onGridReady: (e) => this.onGridReady(e),
    onCellClicked: (e) => this.onCellClicked(e),
  };

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      const data: {
        insurClass: string;
        lineOfBusiness: string;
      } = {
        insurClass: this.f.class?.value!,
        lineOfBusiness: this.f.lineOfBusiness?.value!,
      };
      let sub = this.productionService
        .getAllItems(this.searchURI, data)
        .subscribe(
          (res: HttpResponse<IBaseResponse<ILibrariesFilter[]>>) => {
            if (res.body?.status) {
              this.uiState.lists.itemsList = res.body?.data!;
              params.successCallback(
                this.uiState.lists.itemsList,
                this.uiState.lists.itemsList.length
              );
              if (this.uiState.lists.itemsList.length === 0)
                this.gridApi.showNoRowsOverlay();
              else this.gridApi.hideOverlay();
            } else {
              this.uiState.gridReady = true;
              this.gridApi.hideOverlay();
            }
          },
          (err: HttpErrorResponse) => {
            this.message.popup("Oops!", err.message, "error");
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
    if ((this, this.uiState.lists.itemsList.length > 0))
      this.gridApi.sizeColumnsToFit();
  }

  modalRef!: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private message: MessagesService,
    private methods: MasterMethodsService,
    private productionService: MasterTableProductionService,
    private table: MasterTableService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
    this.lookupData = this.table.getBaseData(
      MODULES.MasterTableProductionLibraries
    );
  }

  initFilterForm() {
    this.formGroup = new FormGroup<ILibrariesForm>({
      sNo: new FormControl(0),
      defaultTick: new FormControl(false),
      class: new FormControl(null),
      lineOfBusiness: new FormControl(null),
      item: new FormControl(null, Validators.required),
      itemArabic: new FormControl(null, Validators.required),
      description: new FormControl(null),
      descriptionArabic: new FormControl(null),
    });
  }

  getLineOfBusiness(cls: string): void {
    let sub = this.methods
      .getLineOfBusiness(cls)
      .subscribe(
        (res: HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>) => {
          this.f.lineOfBusiness?.reset();
          this.uiState.lists.linesOfBusiness = res.body?.data?.content!;
        }
      );
    this.subscribes.push(sub);
  }

  get f() {
    return this.formGroup.controls;
  }

  getEditItemData(id: string) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.productionService
      .editItem(this.editURI, id)
      .subscribe((res: IBaseResponse<ILibrariesReq>) => {
        if (res?.status) {
          this.uiState.editMode = true;
          this.uiState.editItemData = res.data!;
          this.formGroup.patchValue({
            ...this.uiState.editItemData,
            defaultTick:
              this.uiState.editItemData.defaultTick === 1 ? true : false,
          });

          this.f.class?.disable();
          this.f.lineOfBusiness?.disable();

          this.openEditItemDialoge();
          this.eventService.broadcast(reserved.isLoading, false);
        }
      });
    this.subscribes.push(sub);
  }

  deleteItem(id: string) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.productionService
      .deleteItem(this.deleteURI, id)
      .subscribe((res: IBaseResponse<any>) => {
        if (res?.status) {
          this.eventService.broadcast(reserved.isLoading, false);
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res.message!, "success");
        }
      });
    this.subscribes.push(sub);
  }

  validationChecker(): boolean {
    if (this.formGroup.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  onSubmit(formGroup: FormGroup<ILibrariesForm>) {
    this.uiState.submitted = true;
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);

    const data: ILibrariesReq = {
      ...formGroup.getRawValue(),
      defaultTick: formGroup.getRawValue().defaultTick === true ? 1 : 0,
    };
    let sub = this.productionService
      .saveItem(this.saveURI, data)
      .subscribe((res: IBaseResponse<any>) => {
        if (res.status) {
          if (this.uiState.editMode) {
            this.modalRef.dismiss();
            this.eventService.broadcast(reserved.isLoading, false);
          } else this.resetForm();
          this.eventService.broadcast(reserved.isLoading, false);
          this.message.toast(res.message!, "success");
          this.gridApi.setDatasource(this.dataSource);
        }
      });
    this.subscribes.push(sub);
  }

  //#region Edit Dialoge

  openEditItemDialoge() {
    this.modalRef = this.modalService.open(this.EditItemDialoge, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "lg",
    });

    this.modalRef.hidden.subscribe(() => {
      this.resetForm();
      this.submitted = false;
      this.uiState.editMode = false;
    });
  }

  resetForm() {
    this.f.item?.reset();
    this.f.itemArabic?.reset();
    this.f.description?.reset();
    this.f.descriptionArabic?.reset();
    this.f.defaultTick?.reset();
    this.f.class?.enable();
    this.f.lineOfBusiness?.enable();
    this.uiState.submitted = false;
  }

  //#endregion

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
