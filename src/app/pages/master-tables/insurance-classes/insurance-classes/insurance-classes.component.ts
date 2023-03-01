import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { EventService } from "src/app/core/services/event.service";
import { Observable, Subscription } from 'rxjs';
import { IBaseMasterTable } from 'src/app/core/models/masterTableModels';
import { insuranceClassCols } from 'src/app/shared/app/grid/insuranceClassCols';
import { IInsuranceClass } from 'src/app/shared/app/models/MasterTables/i-insurance-class';
import { InsuranceClassesService } from 'src/app/shared/services/master-tables/insurance-classes.service';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { MasterTableService } from 'src/app/core/services/master-table.service';
import AppUtils from 'src/app/shared/app/util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import PerfectScrollbar from 'perfect-scrollbar';


@Component({
  selector: 'app-insurance-classes',
  templateUrl: './insurance-classes.component.html',
  styleUrls: [ './insurance-classes.component.scss' ]
})
export class InsuranceClassesComponent implements OnInit
{

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IInsuranceClass[],
    totalPages: 0,
  };

  lookupData!: Observable<IBaseMasterTable>;

  subscribes: Subscription[] = [];
  gridApi: GridApi = <GridApi> {};
  gridOpts: GridOptions = {
    pagination: true,
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: insuranceClassCols,
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

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();
      let sub = this.InsuranceClassesService.getInsuranceClasses().subscribe(
        (res: HttpResponse<IBaseResponse<IInsuranceClass[]>>) =>
        {
          this.uiState.list = res.body?.data!;
          params.successCallback(this.uiState.list);
          this.uiState.gridReady = true;
          this.gridApi.hideOverlay();
        },
        (err: HttpErrorResponse) =>
        {
          this.message.popup("Oops!", err.message, "error");
        }
      );
      this.subscribes.push(sub);
    },
  };

  constructor (
    private InsuranceClassesService: InsuranceClassesService,
    private tableRef: ElementRef,
    private message: MessagesService,
    private table: MasterTableService,
    private appUtils: AppUtils,
    private eventService: EventService,
    private modalService: NgbModal
  ) { }

  onCellClicked (params: CellEvent)
  {
    if (params.column.getColId() == "action")
    {
      params.api.getCellRendererInstances({
        rowNodes: [ params.node ],
        columns: [ params.column ],
      });
    }
  }

  onPageSizeChange ()
  {
    this.gridApi.showLoadingOverlay();
    this.gridApi.setDatasource(this.dataSource);
  }


  onGridReady (param: GridReadyEvent)
  {
    this.gridApi = param.api;
    this.gridApi.setDatasource(this.dataSource);
    // this.gridApi.sizeColumnsToFit();

    const agBodyHorizontalViewport: HTMLElement = this.tableRef.nativeElement.querySelector("#gridScrollbar .ag-body-horizontal-scroll-viewport");
    const agBodyViewport: HTMLElement = this.tableRef.nativeElement.querySelector("#gridScrollbar .ag-body-viewport");

    if (agBodyViewport)
    {
      const vertical = new PerfectScrollbar(agBodyViewport);
      vertical.update();
    }
    if (agBodyHorizontalViewport)
    {
      const horizontal = new PerfectScrollbar(agBodyHorizontalViewport);
      horizontal.update();
    }
    if ((this, this.uiState.list.length > 0)) this.gridApi.sizeColumnsToFit();
  }


  ngOnInit (): void
  {
  }

}
