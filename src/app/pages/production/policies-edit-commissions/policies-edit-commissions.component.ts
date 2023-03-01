import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ProductionService } from 'src/app/shared/services/production/production.service';
import { NgbModal, NgbModalRef, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { from, Observable, Subscription } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { IBaseMasterTable } from 'src/app/core/models/masterTableModels';
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { productionEditCommissionCols } from 'src/app/shared/app/grid/productionEditCommissionsCols';
import AppUtils from 'src/app/shared/app/util';
import { IEditCommissions } from 'src/app/shared/app/models/Production/i-edit-commissions';
import { AppRoutes } from 'src/app/shared/app/routers/appRouters';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import PerfectScrollbar from 'perfect-scrollbar';
import { MasterTableService } from 'src/app/core/services/master-table.service';
import { MODULES } from 'src/app/core/models/MODULES';
import { IEditCommissionsFilter } from 'src/app/shared/app/models/Production/i-edit-commission-filter';
import { EditModel, EditModelData } from 'src/app/shared/app/models/Production/i-edit-commissions-forms';
import { EventService } from 'src/app/core/services/event.service';
import { reserved } from 'src/app/core/models/reservedWord';
import { IAddProducers } from 'src/app/shared/app/models/Production/i-add-producers';


@Component({
  selector: 'app-policies-edit-commissions',
  templateUrl: './policies-edit-commissions.component.html',
  styleUrls: [ './policies-edit-commissions.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class PoliciesEditCommissionsComponent implements OnInit
{

  submitted = false;
  subBtn: boolean = false;
  uiState = {
    gridReady: false,
    submitted: false,
    filters: {
      pageNumber: 1,
      pageSize: 50,
      orderBy: "sNo",
      orderDir: "asc"
    } as IEditCommissionsFilter,
    editCommissions: {
      list: [] as IEditCommissions[],
      totalPages: 0,
    },
    validate: {
      compCommPerc: 0,
      producerCommPerc: 0
    },
    totalCommissions: {
      prodCommPercentage: 0
    },
    editId: "",
    editUserMode: false as Boolean,
    editUserData: {} as EditModelData,
    producers: [] as any
  }

  @ViewChild("filter") editCommissionFilter!: ElementRef;
  @ViewChild("edit") edit!: ElementRef

  editUserModal!: NgbModalRef;
  editForm!: FormGroup<EditModel>;
  editFormSubmitted = false as boolean;

  filterForms!: FormGroup;
  lookupData!: Observable<IBaseMasterTable>;

  // to unSubscribe
  subscribes: Subscription[] = [];
  // Grid Definitions
  gridApi: GridApi = <GridApi> {};
  gridOpts: GridOptions = {
    pagination: true,
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: productionEditCommissionCols,
    suppressCsvExport: true,
    paginationPageSize: this.uiState.filters.pageSize,
    cacheBlockSize: this.uiState.filters.pageSize,
    context: { comp: this },
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
    },
    onGridReady: (e) => this.onGridReady(e),
    onCellClicked: (e) => this.onCellClicked(e),
    onSortChanged: (e) => this.onSort(e),
    onPaginationChanged: (e) => this.onPageChange(e),
  };



  constructor (
    private modalService: NgbModal,
    private message: MessagesService,
    private productionService: ProductionService,
    private appUtils: AppUtils,
    private tableRef: ElementRef,
    private offcanvasService: NgbOffcanvas,
    private table: MasterTableService,
    private eventService: EventService,

  ) { }

  ngOnInit (): void
  {
    this.initFilterForm();
    this.getLookupData();
    this.initForm();
  }


  // Table Section
  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();

      let sub = this.productionService.getEditCommission(this.uiState.filters).subscribe(
        (res: HttpResponse<IBaseResponse<IEditCommissions[]>>) =>
        {
          this.uiState.editCommissions.totalPages = JSON.parse(res.headers.get("x-pagination")!).TotalCount;

          this.uiState.editCommissions.list = res.body?.data!;

          params.successCallback(this.uiState.editCommissions.list, this.uiState.editCommissions.totalPages);
          this.uiState.gridReady = true;
          this.gridApi.hideOverlay();
        },
        (err: HttpErrorResponse) =>
        {
          this.message.popup("Oops!", err.message, "error");
          this.gridApi.hideOverlay();
        }
      );
      this.subscribes.push(sub);
    },
  };

  onSort (e: GridReadyEvent)
  {
    let colState = e.columnApi.getColumnState();
    colState.forEach((el) =>
    {
      if (el.sort)
      {
        this.uiState.filters.orderBy = el.colId!;
        this.uiState.filters.orderDir = el.sort!;
      }
    });
  }

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
    this.gridApi.paginationSetPageSize(+this.uiState.filters.pageSize);
    this.gridOpts.cacheBlockSize = +this.uiState.filters.pageSize;
    this.gridApi.showLoadingOverlay();
    this.gridApi.setDatasource(this.dataSource);
  }

  onPageChange (params: GridReadyEvent)
  {
    if (this.uiState.gridReady)
    {
      this.uiState.filters.pageNumber = this.gridApi.paginationGetCurrentPage() + 1;
    }
  }

  onGridReady (param: GridReadyEvent)
  {
    this.gridApi = param.api;
    this.gridApi.setDatasource(this.dataSource);
    this.gridApi.sizeColumnsToFit();

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
  }

  //#region filter Section
  openFilterOffcanvas (): void
  {
    this.offcanvasService.open(this.editCommissionFilter, { position: "end" });
  }

  //#init filter form
  private initFilterForm (): void
  {
    this.filterForms = new FormGroup({
      clientName: new FormControl(null),
      policyNumber: new FormControl(null),
      producer: new FormControl(null),
    });
  }

  //#get filter form controls
  get f ()
  {
    return this.filterForms.controls;
  }

  getLookupData ()
  {
    this.lookupData = this.table.getBaseData(MODULES.Production);
  }

  modifyFilterReq ()
  {
    this.uiState.filters = {
      ...this.uiState.filters,
      ...this.filterForms.value,
    };
  }

  onEditCommissionsFilter (): void
  {
    this.modifyFilterReq();
    this.gridApi.setDatasource(this.dataSource);
  }

  clearFilter ()
  {
    this.filterForms.reset();
  }
  //#endregion


  // Edit Form 

  getUserData (id: string)
  {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.productionService.getUserData(id).subscribe(
      (res: HttpResponse<IBaseResponse<EditModelData>>) =>
      {
        this.fillEditForm(res.body?.data!);
        if (res.body?.data?.producer?.startsWith('Direct Business'))
        {
          this.ff.prodCommProduser?.disable();
          this.ff.prodCommPercentage?.disable();
          this.ff.producerCommPerc?.disable();
          this.subBtn = true;
        } else
        {
          this.ff.prodCommProduser?.enable();
          this.ff.prodCommPercentage?.enable();
          this.ff.producerCommPerc?.enable();
          this.subBtn = false;
        }
        this.eventService.broadcast(reserved.isLoading, false);
      },
      (err: HttpErrorResponse) =>
      {
        this.message.popup("Oops!", err.message, "error");
        this.eventService.broadcast(reserved.isLoading, false);
      }
    );
    this.subscribes.push(sub);
  }

  openEditForm (id: string): void
  {
    this.editUserModal = this.modalService.open(this.edit, {
      centered: true,
      backdrop: "static",
      size: "xl",
    });
    this.getUserData(id);

    this.editUserModal.hidden.subscribe(() =>
    {
      this.submitted = false;
      this.uiState.editUserMode = false;
    });
  }

  validationChecker (): boolean
  {
    if (this.editForm.invalid)
    {
      this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
      return false;
    }
    return true;
  }


  //#init edit form
  initForm (): void
  {
    this.editForm = new FormGroup<EditModel>({
      sNo: new FormControl(null),
      clientNo: new FormControl(null),
      producer: new FormControl("", Validators.required),
      clientName: new FormControl(""),
      accNo: new FormControl(""),
      policyNo: new FormControl(""),
      savedBy: new FormControl(""),
      className: new FormControl(""),
      lineOfBusiness: new FormControl(""),
      compCommPerc: new FormControl(""),
      producerCommPerc: new FormControl(""),
      periodFrom: new FormControl(null),
      periodTo: new FormControl(null),
      updatedBy: new FormControl(""),
      insurComp: new FormControl(""),
      prodCommProduser: new FormControl(null, Validators.required),
      prodCommPercentage: new FormControl(null, Validators.required),

      producersCommissions: new FormArray<FormGroup<IAddProducers>>([]),
    })
  }

  //#get edit form controls
  get ff ()
  {
    return this.editForm.controls;
  }

  //#producersCommissions Array
  get producersCommissionsArray (): FormArray
  {
    return this.editForm.get("producersCommissions") as FormArray;
  }

  producersCommissionsControls (i: number, control: string): AbstractControl
  {
    return this.producersCommissionsArray.controls[ i ].get(control)!;
  }

  addProducersCommissions ()
  {

    if (
      +this.ff.compCommPerc?.value! <= 0 ||
      +this.ff.producerCommPerc?.value! > +this.ff.compCommPerc?.value! ||
      +this.ff.prodCommPercentage?.value! > +this.ff.producerCommPerc?.value! ||
      +this.uiState.totalCommissions.prodCommPercentage >=
      +this.ff.producerCommPerc?.value!
    )
    {
      this.message.popup("Oops!", "Can't add any more");
      return;
    }
    else if (this.ff.prodCommProduser?.invalid || this.ff.prodCommPercentage?.invalid)
    {
      this.ff.producersCommissions?.markAllAsTouched();
      this.message.popup("Oops!", "fill input data");
      return;
    } else
    {
      let data: IAddProducers = {
        producer: this.ff.prodCommProduser!,
        percentage: this.ff.prodCommPercentage!
      }

      let producerCommission = new FormGroup<IAddProducers>({
        producer: new FormControl(data?.producer!.value, Validators.required),
        percentage: new FormControl(data.percentage!.value, [
          Validators.max(100),
          Validators.min(0),
          Validators.required,
        ]),
      });
      this.ff.producersCommissions?.push(producerCommission);
      this.producersCommissionsArray.updateValueAndValidity();
      this.totalCommissionRow();
    }
  }


  formListeners (e?: Event): void
  {
    if (+this.ff.producerCommPerc?.value! > +this.ff.compCommPerc?.value!)
    {
      this.ff.producerCommPerc?.patchValue(this.ff.compCommPerc?.value!);
      return;
    } else if (+this.ff.prodCommPercentage?.value! > +this.ff.producerCommPerc?.value!)
    {
      this.ff.prodCommPercentage?.patchValue(+this.ff.producerCommPerc?.value!);
      return;
    } else if (+this.ff.compCommPerc?.value! > 0)
    {
      if (+this.ff.compCommPerc?.value! > 100)
      {
        this.ff.compCommPerc?.patchValue('100');
        return;
      }
    }
  }


  totalCommissionRow ()
  {
    const handler = {
      emitEvent: false,
      OnlySelf: true,
    };
    this.ff.producersCommissions?.controls.forEach((el) =>
    {
      let sub1 = el.controls.percentage?.valueChanges.subscribe((elm) =>
      {
        if (+elm! > +this.ff.prodCommPercentage?.value!)
          el.controls.percentage?.patchValue(
            +this.ff.prodCommPercentage?.value!,
            handler
          );
      });
      this.subscribes.push(sub1!);
    });
    let sub2 = this.producersCommissionsArray.valueChanges.subscribe(
      (el) =>
      {
        this.uiState.totalCommissions = {
          prodCommPercentage: el.reduce(
            (prev: any, next: any) => +prev + +next.percentage,
            0
          )
        };
      }
    );
    this.subscribes.push(sub2);
  }


  changeprod (e: any)
  {
    if (e.id <= 4)
    {
      this.ff.prodCommProduser?.disable();
      this.ff.prodCommPercentage?.disable();
      this.ff.producerCommPerc?.disable();
      this.subBtn = true;
    } else
    {
      this.ff.prodCommProduser?.enable();
      this.ff.prodCommPercentage?.enable();
      this.ff.producerCommPerc?.enable();
      this.subBtn = false;
    }
  }


  deleteProducersCommissions (i: number)
  {
    this.producersCommissionsArray.removeAt(i);
  }

  fillEditForm (data: EditModelData)
  {
    this.ff.sNo?.patchValue(data.sNo!);
    this.ff.clientName?.patchValue(data.clientName!);
    this.ff.producer?.patchValue(data.producer!);
    this.ff.accNo?.patchValue(data.accNo!);
    this.ff.policyNo?.patchValue(data.policyNo!);
    this.ff.savedBy?.patchValue(data.savedBy!);
    this.ff.className?.patchValue(data.className!);
    this.ff.lineOfBusiness?.patchValue(data.lineOfBusiness!);
    this.ff.compCommPerc?.patchValue(data.compCommPerc!);
    this.ff.producerCommPerc?.patchValue(data.producerCommPerc!);
    this.ff.periodFrom?.patchValue(
      this.appUtils.dateStructFormat(data?.periodFrom!) as any
    );
    this.ff.periodTo?.patchValue(
      this.appUtils.dateStructFormat(data?.periodTo!) as any
    );
    this.ff.sNo?.disable();
    this.ff.clientName?.disable();
    this.ff.accNo?.disable();
    this.ff.policyNo?.disable();
    this.ff.savedBy?.disable();
    this.ff.className?.disable();
    this.ff.lineOfBusiness?.disable();
    this.ff.periodFrom?.disable();
    this.ff.periodTo?.disable();
  }

  periodFrom (e: any)
  {
    this.ff.periodFrom?.patchValue(e.gon);
  }
  periodTo (e: any)
  {
    this.ff.periodTo?.patchValue(e.gon);
  }

  submitEditFormData ()
  {
    this.uiState.submitted = true;
    const formData = new FormData();
    let val = this.editForm.getRawValue();
    formData.append("clientName", val.clientName!)
    formData.append("clientName", val.accNo!)
    formData.append("policyNo", val.policyNo!)
    formData.append("savedBy", val.savedBy!)
    formData.append("className", val.className!)
    formData.append("lineOfBusiness", val.lineOfBusiness!)
    formData.append("producer", val.producer!)
    formData.append("producerCommPerc", val.producerCommPerc!)
    formData.append("compCommPerc", val.compCommPerc!)
    formData.append("periodFrom", this.appUtils.dateFormater(val.periodFrom!));
    formData.append("periodTo", this.appUtils.dateFormater(val.periodTo!));
    let commissions = val.producersCommissions!;
    for (let i = 0; i < commissions.length; i++)
    {
      formData.append(
        `producersCommissions[${ i }].producer`,
        commissions[ i ].producer!
      );
      formData.append(
        `producersCommissions[${ i }].percentage`,
        commissions[ i ].percentage?.toString()! ?? ""
      );
    }
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.productionService.UpdatePolicyComissions(formData).subscribe(
      (res: HttpResponse<IBaseResponse<any>>) =>
      {
        this.editUserModal.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetUserForm();
        this.gridApi.setDatasource(this.dataSource);
        this.message.toast(res.body?.message!, "success");
      },
      (err: HttpErrorResponse) =>
      {
        this.message.popup("Oops!", err.error.message, "error");
        this.eventService.broadcast(reserved.isLoading, false);
      }
    );
    this.subscribes.push(sub);
  }

  resetUserForm (): void
  {
    this.editForm.reset();
    this.ff.producersCommissions?.clear();
    this.submitted = false;
  }


  ngOnDestroy (): void
  {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }

}

