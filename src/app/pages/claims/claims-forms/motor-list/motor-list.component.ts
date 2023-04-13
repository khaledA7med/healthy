import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { Subscription } from "rxjs";
import { MotorListCols } from "src/app/shared/app/grid/MotorListCols";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MotorData } from "src/app/shared/app/models/Production/i-active-motor-forms";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";

@Component({
  selector: "app-motor-list",
  templateUrl: "./motor-list.component.html",
  styleUrls: ["./motor-list.component.scss"],
})
export class MotorListComponent implements OnDestroy {
  @Input() policiesSno!: any;

  motorList: MotorData[] = [];
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
    columnDefs: MotorListCols,
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
  onGridReady(param: GridReadyEvent) {
    this.gridApi = param.api;
    this.gridApi.showNoRowsOverlay();
  }

  setDataSource(policiesSno: number) {
    this.gridApi.showLoadingOverlay();
    let sub = this.ProductionService.getMotorDataById(
      String(policiesSno)
    ).subscribe((res: IBaseResponse<MotorData[]>) => {
      if (res.status) {
        this.motorList = res.data!;
        this.gridApi.setRowData(this.motorList);
        this.gridApi.redrawRows();
        if (this.motorList.length === 0) this.gridApi.showNoRowsOverlay();
        else this.gridApi.hideOverlay();
      } else {
        this.message.popup("Oops!", res.message!, "warning");
        this.gridApi.hideOverlay();
      }
      this.gridReady = true;
    });
    this.subscribes.push(sub);
  }

  searchMotor(e: any) {
    let Data = e.target.value;
    this.gridApi.setQuickFilter(Data);
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
