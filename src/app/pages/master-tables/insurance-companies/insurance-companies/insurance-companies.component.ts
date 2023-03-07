import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CellEvent, EventService, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from 'ag-grid-community';
import PerfectScrollbar from 'perfect-scrollbar';
import { Subscription } from 'rxjs';
import { Caching, IGenericResponseType } from 'src/app/core/models/masterTableModels';
import { insuranceCompaniesCols } from 'src/app/shared/app/grid/insuranceCompaniesCols';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { IInsuranceClass } from 'src/app/shared/app/models/MasterTables/i-insurance-class';
import { IInsuranceCompanies, IInsuranceCompaniesData } from 'src/app/shared/app/models/MasterTables/insurance-companies/i-insurance-companies';
import { MasterMethodsService } from 'src/app/shared/services/master-methods.service';
import { InsuranceCompaniesService } from 'src/app/shared/services/master-tables/insurance-companies.service';
import { MessagesService } from 'src/app/shared/services/messages.service';
InsuranceCompaniesService
@Component({
  selector: 'app-insurance-companies',
  templateUrl: './insurance-companies.component.html',
  styleUrls: [ './insurance-companies.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class InsuranceCompaniesComponent implements OnInit
{

  subscribes: Subscription[] = [];
  lineOfBussArr: IGenericResponseType[] = [];
  InsuranceFormSubmitted = false as boolean;
  InsuranceModal!: NgbModalRef;
  InsuranceForm!: FormGroup<IInsuranceClass>;
  // @ViewChild("insuranceContent") insuranceContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IInsuranceCompanies[],
    totalPages: 0,
    editInsuranceMode: false as Boolean,
    editInsuranceData: {} as IInsuranceCompaniesData,
  };

  gridApi: GridApi = <GridApi> {};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: insuranceCompaniesCols,
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

  constructor (
    private masterService: MasterMethodsService,
    private message: MessagesService,
    private InsuranceCompaniesService: InsuranceCompaniesService,
    private tableRef: ElementRef,
    private eventService: EventService,
    private modalService: NgbModal
  ) { }

  ngOnInit (): void
  {
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();
      let sub = this.InsuranceCompaniesService.getInsuranceCompanies().subscribe(
        (res: HttpResponse<IBaseResponse<IInsuranceCompanies[]>>) =>
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

  getLineOfBusiness (className: string)
  {
    let sub = this.masterService.getLineOfBusiness(className).subscribe(
      (res: HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>) =>
      {
        this.lineOfBussArr = res.body?.data?.content!;
      },
      (err) =>
      {
        this.message.popup("Sorry!", err.message!, "warning");
      }
    );
    this.subscribes.push(sub);
  }

  test ()
  {
    console.log("aaaaaaaaa")
  }

}
