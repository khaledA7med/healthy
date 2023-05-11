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
import { bankSettingsCols } from "src/app/shared/app/grid/bankSettingsCols";
import { BankSettingsService } from "src/app/shared/services/master-tables/bank-settings.service";
import {
  IBankSettings,
  IBankSettingsData,
} from "src/app/shared/app/models/MasterTables/i-bank-settings";

@Component({
  selector: "app-bank-settings",
  templateUrl: "./bank-settings.component.html",
  styleUrls: ["./bank-settings.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BankSettingsComponent implements OnInit, OnDestroy {
  BankSettingsFormSubmitted = false as boolean;
  BankSettingsModal!: NgbModalRef;
  BankSettingsForm!: FormGroup<IBankSettings>;
  @ViewChild("BankSettingsContent") BankSettingsContent!: TemplateRef<any>;

  uiState = {
    isLoading: false as boolean,
    gridReady: false,
    submitted: false,
    list: [] as IBankSettings[],
    totalPages: 0,
    editBankSettingsMode: false as Boolean,
    editBankSettingsData: {} as IBankSettingsData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    rowSelection: "single",
    columnDefs: bankSettingsCols,
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
    private BankSettingsService: BankSettingsService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initBankSettingsForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.BankSettingsService.getBankSettings().subscribe(
        (res: HttpResponse<IBaseResponse<IBankSettings[]>>) => {
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

  openBankSettingsDialoge(id?: string) {
    this.resetBankSettingsForm();
    this.BankSettingsModal = this.modalService.open(this.BankSettingsContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });
    if (id) {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.BankSettingsService.getEditBankSettings(id).subscribe(
        (res: IBaseResponse<IBankSettingsData>) => {
          this.uiState.editBankSettingsMode = true;
          this.uiState.editBankSettingsData = res?.data!;
          this.fillEditBankSettingsForm(res?.data!);
          this.eventService.broadcast(reserved.isLoading, false);
        }
      );
      this.subscribes.push(sub);
    }

    this.BankSettingsModal.hidden.subscribe(() => {
      this.resetBankSettingsForm();
      this.BankSettingsFormSubmitted = false;
      this.uiState.editBankSettingsMode = false;
    });
  }

  initBankSettingsForm() {
    this.BankSettingsForm = new FormGroup<IBankSettings>({
      sNo: new FormControl(null),
      bankName: new FormControl(null, Validators.required),
      swift: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.BankSettingsForm.controls;
  }

  fillEditBankSettingsForm(data: IBankSettingsData) {
    this.f.bankName?.patchValue(data.bankName!);
    this.f.swift?.patchValue(data.swift!);
  }

  validationChecker(): boolean {
    if (this.BankSettingsForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  submitBankSettingsData(form: FormGroup) {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IBankSettingsData = {
      sNo: this.uiState.editBankSettingsMode
        ? this.uiState.editBankSettingsData.sNo
        : 0,
      bankName: formData.bankName,
      swift: formData.swift,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.BankSettingsService.saveBankSettings(data).subscribe(
      (res: IBaseResponse<number>) => {
        this.BankSettingsModal.dismiss();
        this.uiState.submitted = false;
        this.resetBankSettingsForm();
        this.gridApi.setDatasource(this.dataSource);
        this.eventService.broadcast(reserved.isLoading, false);
        this.message.toast(res?.message!, "success");
      }
    );
    this.subscribes.push(sub);
  }

  resetBankSettingsForm() {
    this.BankSettingsForm.reset();
  }

  DeleteBankSettings(id: string) {
    let sub = this.BankSettingsService.DeleteBankSettings(id).subscribe(
      (res: IBaseResponse<any>) => {
        this.gridApi.setDatasource(this.dataSource);
        if (res?.status) this.message.toast(res!.message!, "success");
      }
    );
    this.subscribes.push(sub);
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
