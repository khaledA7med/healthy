import { HttpResponse } from "@angular/common/http";
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
import { clientCategoriesCols } from "src/app/shared/app/grid/clientCategoriesCols";
import { ClientCategoriesService } from "src/app/shared/services/master-tables/client-categories.service";
import {
  IClientCategories,
  IClientCategoriesData,
} from "src/app/shared/app/models/MasterTables/i-client-categories";

@Component({
  selector: "app-client-categories",
  templateUrl: "./client-categories.component.html",
  styleUrls: ["./client-categories.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ClientCategoriesComponent implements OnInit, OnDestroy {
  ClientCategoriesFormSubmitted = false as boolean;
  ClientCategoriesModal!: NgbModalRef;
  ClientCategoriesForm!: FormGroup<IClientCategories>;
  @ViewChild("ClientCategoriesContent")
  ClientCategoriesContent!: TemplateRef<any>;

  uiState = {
    isLoading: false as boolean,
    gridReady: false,
    submitted: false,
    list: [] as IClientCategories[],
    totalPages: 0,
    editClientCategoriesMode: false as Boolean,
    editClientCategoriesData: {} as IClientCategoriesData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    rowSelection: "single",
    columnDefs: clientCategoriesCols,
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
    private ClientCategoriesService: ClientCategoriesService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initClientCategoriesForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.ClientCategoriesService.getClientCategories().subscribe(
        (res: HttpResponse<IBaseResponse<IClientCategories[]>>) => {
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

  openClientCategoriesDialoge(id?: string) {
    this.resetClientCategoriesForm();
    this.ClientCategoriesModal = this.modalService.open(
      this.ClientCategoriesContent,
      {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        size: "md",
      }
    );
    if (id) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.ClientCategoriesService.getEditClientCategories(
        id
      ).subscribe((res: IBaseResponse<IClientCategoriesData>) => {
        if (res?.status) {
          this.uiState.editClientCategoriesMode = true;
          this.uiState.editClientCategoriesData = res?.data!;
          this.fillEditClientCategoriesForm(res?.data!);
          this.eventService.broadcast(reserved.isLoading, false);
        }
      });
      this.subscribes.push(sub);
    }

    this.ClientCategoriesModal.hidden.subscribe(() => {
      this.resetClientCategoriesForm();
      this.ClientCategoriesFormSubmitted = false;
      this.uiState.editClientCategoriesMode = false;
    });
  }

  initClientCategoriesForm() {
    this.ClientCategoriesForm = new FormGroup<IClientCategories>({
      sno: new FormControl(null),
      category: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.ClientCategoriesForm.controls;
  }

  fillEditClientCategoriesForm(data: IClientCategoriesData) {
    this.f.category?.patchValue(data.category!);
  }

  validationChecker(): boolean {
    if (this.ClientCategoriesForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  submitClientCategoriesData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IClientCategoriesData = {
      sno: this.uiState.editClientCategoriesMode
        ? this.uiState.editClientCategoriesData.sno
        : 0,
      category: formData.category,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.ClientCategoriesService.saveClientCategories(data).subscribe(
      (res: IBaseResponse<number>) => {
        if (res?.status) {
          this.ClientCategoriesModal.dismiss();
          this.uiState.submitted = false;
          this.resetClientCategoriesForm();
          this.eventService.broadcast(reserved.isLoading, false);
          this.gridApi.setDatasource(this.dataSource);
          this.message.toast(res?.message!, "success");
        }
      }
    );
    this.subscribes.push(sub);
  }

  resetClientCategoriesForm() {
    this.ClientCategoriesForm.reset();
  }

  DeleteClientCategories(id: string) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.ClientCategoriesService.DeleteClientCategories(id).subscribe(
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
