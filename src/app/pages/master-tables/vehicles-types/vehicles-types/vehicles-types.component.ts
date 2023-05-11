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
import { Subscription } from "rxjs";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { reserved } from "src/app/core/models/reservedWord";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { vehiclesTypesCols } from "src/app/shared/app/grid/vehiclesTypesCols";
import { VehiclesTypesService } from "src/app/shared/services/master-tables/vehicles-types.service";
import {
  IVehiclesTypes,
  IVehiclesTypesData,
} from "src/app/shared/app/models/MasterTables/i-vehicles-types";

@Component({
  selector: "app-vehicles-types",
  templateUrl: "./vehicles-types.component.html",
  styleUrls: ["./vehicles-types.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class VehiclesTypesComponent implements OnInit, OnDestroy {
  VehiclesTypesFormSubmitted = false as boolean;
  VehiclesTypesModal!: NgbModalRef;
  VehiclesTypesForm!: FormGroup<IVehiclesTypes>;
  @ViewChild("VehiclesTypesContent") VehiclesTypesContent!: TemplateRef<any>;

  uiState = {
    isLoading: false as boolean,
    gridReady: false,
    submitted: false,
    list: [] as IVehiclesTypes[],
    totalPages: 0,
    editVehiclesTypesMode: false as Boolean,
    editVehiclesTypesData: {} as IVehiclesTypesData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    rowSelection: "single",
    columnDefs: vehiclesTypesCols,
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

  constructor(
    private VehiclesTypesService: VehiclesTypesService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initVehiclesTypesForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.VehiclesTypesService.getVehiclesTypes().subscribe(
        (res: HttpResponse<IBaseResponse<IVehiclesTypes[]>>) => {
          if (res.body?.status) {
            this.uiState.list = res.body?.data!;
            params.successCallback(this.uiState.list, this.uiState.list.length);
            if (this.uiState.list.length === 0)
              this.gridApi.showNoRowsOverlay();
            else this.gridApi.hideOverlay();
          } else {
            this.message.popup("Oops!", res.body?.message!, "warning");
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

  openVehiclesTypeDialoge(id?: string) {
    this.resetVehiclesTypesForm();
    this.VehiclesTypesModal = this.modalService.open(
      this.VehiclesTypesContent,
      {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        size: "md",
      }
    );
    if (id) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.VehiclesTypesService.getEditVehiclesTypes(id).subscribe(
        (res: IBaseResponse<IVehiclesTypesData>) => {
          if (res?.status) {
            this.uiState.editVehiclesTypesMode = true;
            this.uiState.editVehiclesTypesData = res?.data!;
            this.fillEditVehiclesTypesForm(res?.data!);
            this.eventService.broadcast(reserved.isLoading, false);
          }
        }
      );
      this.subscribes.push(sub);
    }

    this.VehiclesTypesModal.hidden.subscribe(() => {
      this.resetVehiclesTypesForm();
      this.VehiclesTypesFormSubmitted = false;
      this.uiState.editVehiclesTypesMode = false;
    });
  }

  initVehiclesTypesForm() {
    this.VehiclesTypesForm = new FormGroup<IVehiclesTypes>({
      sNo: new FormControl(null),
      vehicleType: new FormControl(null, Validators.required),
      abbreviation: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.VehiclesTypesForm.controls;
  }

  fillEditVehiclesTypesForm(data: IVehiclesTypesData) {
    this.f.vehicleType?.patchValue(data.vehicleType!);
    this.f.abbreviation?.patchValue(data.abbreviation!);
  }

  validationChecker(): boolean {
    if (this.VehiclesTypesForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  submitVehiclesTypesData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IVehiclesTypesData = {
      sNo: this.uiState.editVehiclesTypesMode
        ? this.uiState.editVehiclesTypesData.sNo
        : 0,
      vehicleType: formData.vehicleType,
      abbreviation: formData.abbreviation,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.VehiclesTypesService.saveVehiclesTypes(data).subscribe(
      (res: IBaseResponse<number>) => {
        if (res?.status) {
          this.VehiclesTypesModal.dismiss();
          this.uiState.submitted = false;
          this.resetVehiclesTypesForm();
          this.eventService.broadcast(reserved.isLoading, false);
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res?.message!, "success");
        }
      }
    );
    this.subscribes.push(sub);
  }

  resetVehiclesTypesForm() {
    this.VehiclesTypesForm.reset();
  }

  DeleteVehiclesTypes(id: string) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.VehiclesTypesService.DeleteVehiclesTypes(id).subscribe(
      (res: IBaseResponse<any>) => {
        this.gridApi.setDatasource(this.dataSource);
        if (res?.status) {
          this.eventService.broadcast(reserved.isLoading, false);
          this.message.toast(res!.message!, "success");
        }
      }
    );
    this.subscribes.push(sub);
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
