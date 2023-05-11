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
import { nationalitiesCols } from "src/app/shared/app/grid/nationalitiesCols";
import { NationalitiesService } from "src/app/shared/services/master-tables/nationalities.service";
import {
  INationalties,
  INationaltiesData,
} from "src/app/shared/app/models/MasterTables/i-nationalities";

@Component({
  selector: "app-nationalities",
  templateUrl: "./nationalities.component.html",
  styleUrls: ["./nationalities.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class NationalitiesComponent implements OnInit, OnDestroy {
  NationalitiesFormSubmitted = false as boolean;
  NationalitiesModal!: NgbModalRef;
  NationalitiesForm!: FormGroup<INationalties>;
  @ViewChild("NationalitiesContent") NationalitiesContent!: TemplateRef<any>;

  uiState = {
    isLoading: false as boolean,
    gridReady: false,
    submitted: false,
    list: [] as INationalties[],
    totalPages: 0,
    editNationalitiesMode: false as Boolean,
    editNationalitiesData: {} as INationaltiesData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    rowSelection: "single",
    columnDefs: nationalitiesCols,
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
    private NationalitiesService: NationalitiesService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initnationalitiesForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.NationalitiesService.getNationalities().subscribe(
        (res: HttpResponse<IBaseResponse<INationalties[]>>) => {
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

  openNationalitiesDialoge(id?: string) {
    this.resetNationalitiesForm();
    this.NationalitiesModal = this.modalService.open(
      this.NationalitiesContent,
      {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        size: "md",
      }
    );
    if (id) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.NationalitiesService.getEditNationalities(id).subscribe(
        (res: IBaseResponse<INationaltiesData>) => {
          if (res?.status) {
            this.uiState.editNationalitiesMode = true;
            this.uiState.editNationalitiesData = res?.data!;
            this.fillEditNationalitiesForm(res?.data!);
            this.eventService.broadcast(reserved.isLoading, false);
          }
        }
      );
      this.subscribes.push(sub);
    }

    this.NationalitiesModal.hidden.subscribe(() => {
      this.resetNationalitiesForm();
      this.NationalitiesFormSubmitted = false;
      this.uiState.editNationalitiesMode = false;
    });
  }

  initnationalitiesForm() {
    this.NationalitiesForm = new FormGroup<INationalties>({
      sno: new FormControl(null),
      nationality: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.NationalitiesForm.controls;
  }

  fillEditNationalitiesForm(data: INationaltiesData) {
    this.f.nationality?.patchValue(data.nationality!);
  }

  validationChecker(): boolean {
    if (this.NationalitiesForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  submitNationalitiesData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: INationaltiesData = {
      sno: this.uiState.editNationalitiesMode
        ? this.uiState.editNationalitiesData.sno
        : 0,
      nationality: formData.nationality,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.NationalitiesService.saveNationalities(data).subscribe(
      (res: IBaseResponse<number>) => {
        if (res?.status) {
          this.NationalitiesModal.dismiss();
          this.uiState.submitted = false;
          this.resetNationalitiesForm();
          this.eventService.broadcast(reserved.isLoading, false);
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res?.message!, "success");
        }
      }
    );
    this.subscribes.push(sub);
  }

  resetNationalitiesForm() {
    this.NationalitiesForm.reset();
  }

  DeleteNationalities(id: string) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.NationalitiesService.DeleteNationalities(id).subscribe(
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
