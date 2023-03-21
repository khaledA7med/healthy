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
import { citiesCols } from "src/app/shared/app/grid/citiesCols";
import { CitiesService } from "src/app/shared/services/master-tables/cities.service";
import {
  ICities,
  ICitiesData,
} from "src/app/shared/app/models/MasterTables/i-cities";

@Component({
  selector: "app-cities",
  templateUrl: "./cities.component.html",
  styleUrls: ["./cities.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CitiesComponent implements OnInit, OnDestroy {
  CitiesFormSubmitted = false as boolean;
  CitiesModal!: NgbModalRef;
  CitiesForm!: FormGroup<ICities>;
  @ViewChild("CitiesContent") CitiesContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as ICities[],
    totalPages: 0,
    editCitiesMode: false as Boolean,
    editCitiesData: {} as ICitiesData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: citiesCols,
    suppressCsvExport: true,
    context: { comp: this },
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
    },
    onGridReady: (e) => this.onGridReady(e),
    onCellClicked: (e) => this.onCellClicked(e),
  };

  constructor(
    private CitiesService: CitiesService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initCitiesForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.CitiesService.getCities().subscribe(
        (res: HttpResponse<IBaseResponse<ICities[]>>) => {
          if (res.body?.status) {
            this.uiState.list = res.body?.data!;
            params.successCallback(this.uiState.list, this.uiState.list.length);
            this.uiState.gridReady = true;
            this.gridApi.hideOverlay();
          } else this.message.popup("Sorry!", res.body?.message!, "warning");
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

  openCitiesDialoge(id?: string) {
    this.resetCitiesForm();
    this.CitiesModal = this.modalService.open(this.CitiesContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });
    if (id) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.CitiesService.getEditCities(id).subscribe(
        (res: HttpResponse<IBaseResponse<ICitiesData>>) => {
          if (res.body?.status) {
            this.uiState.editCitiesMode = true;
            this.uiState.editCitiesData = res.body?.data!;
            this.fillAddCitiesForm(res.body?.data!);
            this.eventService.broadcast(reserved.isLoading, false);
          } else this.message.popup("Sorry!", res.body?.message!, "warning");
        }
      );
      this.subscribes.push(sub);
    }

    this.CitiesModal.hidden.subscribe(() => {
      this.resetCitiesForm();
      this.CitiesFormSubmitted = false;
      this.uiState.editCitiesMode = false;
    });
  }

  initCitiesForm() {
    this.CitiesForm = new FormGroup<ICities>({
      sNo: new FormControl(null),
      city: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.CitiesForm.controls;
  }

  fillAddCitiesForm(data: ICitiesData) {
    this.f.city?.patchValue(data.city!);
  }

  fillEditCitiesForm(data: ICitiesData) {
    this.f.city?.patchValue(data.city!);
  }

  validationChecker(): boolean {
    if (this.CitiesForm.invalid) {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  submitCitiesData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: ICitiesData = {
      sNo: this.uiState.editCitiesMode ? this.uiState.editCitiesData.sNo : 0,
      city: formData.city,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.CitiesService.saveCities(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.CitiesModal.dismiss();
          this.eventService.broadcast(reserved.isLoading, false);
          this.uiState.submitted = false;
          this.resetCitiesForm();
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res.body?.message!, "success");
        } else this.message.popup("Sorry!", res.body?.message!, "warning");
      }
    );
    this.subscribes.push(sub);
  }

  resetCitiesForm() {
    this.CitiesForm.reset();
  }

  DeleteCities(id: string) {
    let sub = this.CitiesService.DeleteCities(id).subscribe(
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