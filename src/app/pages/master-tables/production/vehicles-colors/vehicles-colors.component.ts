import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { IGenericResponseType } from "src/app/core/models/masterTableModels";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import {
  CellEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { MasterTableProductionService } from "src/app/shared/services/master-tables/production/production.service";
import {
  IVehicleColorFilter,
  IVehicleColorForm,
  IVehicleColorReq,
} from "src/app/shared/app/models/MasterTables/production/i-vehicle-color";
import { VehicleColorCols } from "src/app/shared/app/grid/MasterTableVehicleColorCols";
@Component({
  selector: "app-vehicles-colors",
  templateUrl: "./vehicles-colors.component.html",
  styleUrls: ["./vehicles-colors.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class VehiclesColorsComponent implements OnInit, OnDestroy {
  @ViewChild("formDialoge") formDialoge!: TemplateRef<any>;
  formGroup!: FormGroup<IVehicleColorForm>;
  submitted: boolean = false;

  subscribes: Subscription[] = [];
  uiState = {
    submitted: false as Boolean,
    gridReady: false as Boolean,
    lists: {
      itemsList: [] as IVehicleColorFilter[],
      linesOfBusiness: [] as IGenericResponseType[],
    },
    editItemData: {} as IVehicleColorReq,
    editMode: false as Boolean,
  };
  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: VehicleColorCols,
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

      let sub = this.productionService.getVehicleColor().subscribe(
        (res: HttpResponse<IBaseResponse<IVehicleColorFilter[]>>) => {
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
    private productionService: MasterTableProductionService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<IVehicleColorForm>({
      sNo: new FormControl(0),
      color: new FormControl("", Validators.required),
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  getEditItemData(id: string) {
    let sub = this.productionService.editVehicleColor(id).subscribe(
      (res: IBaseResponse<IVehicleColorReq>) => {
        if (res?.status) {
          this.uiState.editMode = true;
          this.uiState.editItemData = res.data!;
          this.formGroup.patchValue({
            sNo: this.uiState.editItemData.sNo!,
            color: this.uiState.editItemData.color!,
          });
          this.openformDialoge();
        } else this.message.toast(res.message!, "error");
      },
      (err: HttpErrorResponse) => {
        this.message.popup("Oops!", err.message, "error");
      }
    );
    this.subscribes.push(sub);
  }

  deleteItem(id: string) {
    let sub = this.productionService.deleteVehicleColor(id).subscribe(
      (res: IBaseResponse<any>) => {
        if (res?.status) {
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res.message!, "success");
        } else this.message.toast(res.message!, "error");
      },
      (err: HttpErrorResponse) => {
        this.message.popup("Oops!", err.message, "error");
      }
    );
    this.subscribes.push(sub);
  }

  onSubmit(formGroup: FormGroup<IVehicleColorForm>) {
    this.uiState.submitted = true;
    if (this.formGroup?.invalid) {
      return;
    }
    this.eventService.broadcast(reserved.isLoading, true);
    const data: IVehicleColorReq = {
      ...formGroup.getRawValue(),
    };
    let sub = this.productionService
      .saveVehicleColor(data)
      .subscribe((res: IBaseResponse<any>) => {
        if (res.status) {
          this.modalRef.dismiss();
          this.eventService.broadcast(reserved.isLoading, false);
          this.message.toast(res.message!, "success");
          this.gridApi.setDatasource(this.dataSource);
        } else this.message.popup("Sorry!", res.message!, "warning");
        // Hide Loader
        this.eventService.broadcast(reserved.isLoading, false);
      });
    this.subscribes.push(sub);
  }

  openformDialoge() {
    this.modalRef = this.modalService.open(this.formDialoge, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "lg",
    });

    this.modalRef.hidden.subscribe(() => {
      this.resetForm();
    });
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }

  resetForm() {
    this.formGroup.reset();
    this.f.sNo?.patchValue(0);
    this.uiState.editMode = false;
    this.uiState.submitted = false;
  }
}
