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
import { carsMakeCols } from "src/app/shared/app/grid/carsMakeCols";
import { CarsMakeService } from "src/app/shared/services/master-tables/claims/cars-make.service";
import {
  ICarsMake,
  ICarsMakeData,
} from "src/app/shared/app/models/MasterTables/claims/i-cars-make";

@Component({
  selector: "app-cars-make",
  templateUrl: "./cars-make.component.html",
  styleUrls: ["./cars-make.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CarsMakeComponent implements OnInit, OnDestroy {
  CarsMakeFormSubmitted = false as boolean;
  CarsMakeModal!: NgbModalRef;
  CarsMakeForm!: FormGroup<ICarsMake>;
  @ViewChild("CarsMakeContent") CarsMakeContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as ICarsMake[],
    totalPages: 0,
    editCarsMakeMode: false as Boolean,
    editCarsMakeData: {} as ICarsMakeData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: carsMakeCols,
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
    private CarsMakeService: CarsMakeService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initCarsMakeForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.CarsMakeService.getCarsMake().subscribe(
        (res: HttpResponse<IBaseResponse<ICarsMake[]>>) => {
          if (res.body?.status) {
            this.uiState.list = res.body?.data!;
            params.successCallback(this.uiState.list, this.uiState.list.length);
            this.uiState.gridReady = true;
            this.gridApi.hideOverlay();
          } else this.message.toast(res.body!.message!, "error");
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

  openCarsMakeDialoge(sno?: number) {
    this.resetCarsMakeForm();
    this.CarsMakeModal = this.modalService.open(this.CarsMakeContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });
    if (sno) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.CarsMakeService.getEditCarsMake(sno).subscribe(
        (res: HttpResponse<IBaseResponse<ICarsMakeData>>) => {
          if (res.body?.status) {
            this.uiState.editCarsMakeMode = true;
            this.uiState.editCarsMakeData = res.body?.data!;
            this.fillAddCarsMakeForm(res.body?.data!);
            this.eventService.broadcast(reserved.isLoading, false);
          } else this.message.toast(res.body!.message!, "error");
        }
      );
      this.subscribes.push(sub);
    }

    this.CarsMakeModal.hidden.subscribe(() => {
      this.resetCarsMakeForm();
      this.CarsMakeFormSubmitted = false;
      this.uiState.editCarsMakeMode = false;
    });
  }

  initCarsMakeForm() {
    this.CarsMakeForm = new FormGroup<ICarsMake>({
      sno: new FormControl(null),
      carsMake: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.CarsMakeForm.controls;
  }

  fillAddCarsMakeForm(data: ICarsMakeData) {
    this.f.carsMake?.patchValue(data.carsMake!);
  }

  fillEditCarsMakeForm(data: ICarsMakeData) {
    this.f.carsMake?.patchValue(data.carsMake!);
  }

  validationChecker(): boolean {
    if (this.CarsMakeForm.invalid) {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  submitCarsMakeData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: ICarsMakeData = {
      sno: this.uiState.editCarsMakeMode
        ? this.uiState.editCarsMakeData.sno
        : 0,
      carsMake: formData.carsMake,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.CarsMakeService.saveCarsMake(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) => {
        if (res.body?.status) {
          this.CarsMakeModal.dismiss();
          this.eventService.broadcast(reserved.isLoading, false);
          this.uiState.submitted = false;
          this.resetCarsMakeForm();
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res.body?.message!, "success");
        } else this.message.toast(res.body!.message!, "error");
      }
    );
    this.subscribes.push(sub);
  }

  resetCarsMakeForm() {
    this.CarsMakeForm.reset();
  }

  DeleteCarsMake(sno: number) {
    let sub = this.CarsMakeService.DeleteCarsMake(sno).subscribe(
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
