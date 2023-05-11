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
import { locationsCols } from "src/app/shared/app/grid/locationsCols";
import { LocationsService } from "src/app/shared/services/master-tables/locations.service";
import {
  ILocations,
  ILocationsData,
} from "src/app/shared/app/models/MasterTables/i-locations";

@Component({
  selector: "app-locations",
  templateUrl: "./locations.component.html",
  styleUrls: ["./locations.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LocationsComponent implements OnInit, OnDestroy {
  LocationsFormSubmitted = false as boolean;
  LocationsModal!: NgbModalRef;
  LocationsForm!: FormGroup<ILocations>;
  @ViewChild("LocationsContent") LocationsContent!: TemplateRef<any>;

  uiState = {
    isLoading: false as boolean,
    gridReady: false,
    submitted: false,
    list: [] as ILocations[],
    totalPages: 0,
    editLocationsMode: false as Boolean,
    editLocationsData: {} as ILocationsData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    rowSelection: "single",
    columnDefs: locationsCols,
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
    private LocationsService: LocationsService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initLocationsForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.LocationsService.getLocations().subscribe(
        (res: HttpResponse<IBaseResponse<ILocations[]>>) => {
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

  openLocationsDialoge(id?: string) {
    this.resetLocationsForm();
    this.LocationsModal = this.modalService.open(this.LocationsContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });
    if (id) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.LocationsService.getEditLocations(id).subscribe(
        (res: IBaseResponse<ILocationsData>) => {
          if (res?.status) {
            this.uiState.editLocationsMode = true;
            this.uiState.editLocationsData = res?.data!;
            this.fillEditLocationsForm(res?.data!);
            this.eventService.broadcast(reserved.isLoading, false);
          }
        }
      );
      this.subscribes.push(sub);
    }

    this.LocationsModal.hidden.subscribe(() => {
      this.resetLocationsForm();
      this.LocationsFormSubmitted = false;
      this.uiState.editLocationsMode = false;
    });
  }

  initLocationsForm() {
    this.LocationsForm = new FormGroup<ILocations>({
      sno: new FormControl(null),
      locationName: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.LocationsForm.controls;
  }

  fillEditLocationsForm(data: ILocationsData) {
    this.f.locationName?.patchValue(data.locationName!);
  }

  validationChecker(): boolean {
    if (this.LocationsForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  submitLocationsData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: ILocationsData = {
      sno: this.uiState.editLocationsMode
        ? this.uiState.editLocationsData.sno
        : 0,
      locationName: formData.locationName,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.LocationsService.saveLocations(data).subscribe(
      (res: IBaseResponse<number>) => {
        if (res?.status) {
          this.LocationsModal.dismiss();
          this.uiState.submitted = false;
          this.resetLocationsForm();
          this.eventService.broadcast(reserved.isLoading, false);
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res?.message!, "success");
        }
      }
    );
    this.subscribes.push(sub);
  }

  resetLocationsForm() {
    this.LocationsForm.reset();
  }

  DeleteLocations(id: string) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.LocationsService.DeleteLocations(id).subscribe(
      (res: IBaseResponse<any>) => {
        this.gridApi.setDatasource(this.dataSource);
        if (res?.status) {
          this.eventService.broadcast(reserved.isLoading, false);
          this.message.toast(res?.message!, "success");
        }
      }
    );
    this.subscribes.push(sub);
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
