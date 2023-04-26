import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { Subscription } from "rxjs";
import { MedicalListCols } from "src/app/shared/app/grid/MedicalListCols";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MedicalData } from "src/app/shared/app/models/Production/i-active-medical-forms";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";

@Component({
  selector: "app-medical-list",
  templateUrl: "./medical-list.component.html",
  styleUrls: ["./medical-list.component.scss"],
})
export class MedicalListComponent implements OnDestroy {
  @Input() policiesSno!: any;

  medicalList: MedicalData[] = [];
  subscribes: Subscription[] = [];
  constructor(
    private message: MessagesService,
    private ProductionService: ProductionService
  ) {}

  gridReady: boolean = false;
  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    pagination: true,
    rowModelType: "clientSide",
    editType: "fullRow",
    columnDefs: MedicalListCols,
    animateRows: true,
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      resizable: true,
      sortable: true,
    },
    overlayNoRowsTemplate:
      "<alert class='alert alert-secondary'>No Data To Show</alert>",
    onGridReady: (e) => this.onGridReady(e),
  };

  searchMedical(e: any) {
    let Data = e.target.value;
    this.gridApi.setQuickFilter(Data);
  }

  onGridReady(param: GridReadyEvent) {
    this.gridApi = param.api;
    this.gridApi.showNoRowsOverlay();
  }

  setDataSource(policiesSno: number) {
    this.gridApi.showLoadingOverlay();
    let sub = this.ProductionService.getMedicalDataById(
      String(policiesSno)
    ).subscribe((res: IBaseResponse<MedicalData[]>) => {
      if (res.status) {
        this.medicalList = res.data!;
        this.gridApi.setRowData(this.medicalList);
        this.gridApi.redrawRows();
        if (this.medicalList.length === 0) this.gridApi.showNoRowsOverlay();
        else this.gridApi.hideOverlay();
      } else {
        this.message.popup("Oops!", res.message!, "warning");
        this.gridApi.hideOverlay();
      }
      this.gridReady = true;
    });
    this.subscribes.push(sub);
  }
  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
