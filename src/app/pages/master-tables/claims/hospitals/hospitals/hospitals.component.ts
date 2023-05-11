import { HttpResponse } from "@angular/common/http";
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import {
  CellEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { HospitalsService } from "src/app/shared/services/master-tables/claims/hospitals.service";
import { hospitalsCols } from "src/app/shared/app/grid/hospitalsCols";
import {
  IHospitals,
  IHospitalsData,
} from "src/app/shared/app/models/MasterTables/claims/hospitals/i-hospitals";
import {
  IContactList,
  IContactListData,
} from "src/app/shared/app/models/MasterTables/claims/hospitals/i-contact-list";
import {
  INetworkList,
  INetworkListData,
} from "src/app/shared/app/models/MasterTables/claims/hospitals/i-network-list";
import { IHospitalsPreview } from "src/app/shared/app/models/MasterTables/claims/hospitals/i-hospitals-preview";
import { HospitalFormsComponent } from "../hospital-forms/hospital-forms.component";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";

@Component({
  selector: "app-hospitals",
  templateUrl: "./hospitals.component.html",
  styleUrls: ["./hospitals.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HospitalsComponent implements OnInit, OnDestroy {
  lookupData!: Observable<IBaseMasterTable>;
  subscribes: Subscription[] = [];
  HospitalsModal!: NgbModalRef;

  uiState = {
    isLoading: false as boolean,
    gridReady: false,
    submitted: false,
    list: [] as IHospitals[],
    totalPages: 0,
    editHospitalsMode: false as Boolean,
    editHospitalsData: {} as IHospitalsData,
  };

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    rowSelection: "single",
    columnDefs: hospitalsCols,
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
    private message: MessagesService,
    private HospitalsService: HospitalsService,
    private modalService: NgbModal,
    private eventService: EventService
  ) {}

  ngOnInit(): void {}

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub = this.HospitalsService.getHospitals().subscribe(
        (res: HttpResponse<IBaseResponse<IHospitals[]>>) => {
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

  openHospitalsDialoge(sno?: number) {
    this.HospitalsModal = this.modalService.open(HospitalFormsComponent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "xl",
    });
    this.HospitalsModal.componentInstance.data = {
      sno,
    };
  }

  DeleteHospitals(sno: number) {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.HospitalsService.DeleteHospitals(sno).subscribe(
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
