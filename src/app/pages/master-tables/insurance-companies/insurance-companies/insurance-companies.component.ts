import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { EventService } from "src/app/core/services/event.service";
import { Observable, Subscription } from 'rxjs';
import { Caching, IBaseMasterTable, IGenericResponseType } from 'src/app/core/models/masterTableModels';
import { insuranceCompaniesCols } from 'src/app/shared/app/grid/insuranceCompaniesCols';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { IInsuranceCompanies, IInsuranceCompaniesData } from 'src/app/shared/app/models/MasterTables/insurance-companies/i-insurance-companies';
import { MasterMethodsService } from 'src/app/shared/services/master-methods.service';
import { InsuranceCompaniesService } from 'src/app/shared/services/master-tables/insurance-companies.service';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { reserved } from 'src/app/core/models/reservedWord';
import { IContactList } from 'src/app/shared/app/models/MasterTables/insurance-companies/i-contact-list';
import { MasterTableService } from 'src/app/core/services/master-table.service';
import { MODULES } from 'src/app/core/models/MODULES';
import { IProductsList } from 'src/app/shared/app/models/MasterTables/insurance-companies/i-products-list';

@Component({
  selector: 'app-insurance-companies',
  templateUrl: './insurance-companies.component.html',
  styleUrls: [ './insurance-companies.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class InsuranceCompaniesComponent implements OnInit
{

  lookupData!: Observable<IBaseMasterTable>;
  subscribes: Subscription[] = [];
  lineOfBussArr: IGenericResponseType[] = [];
  InsuranceFormSubmitted = false as boolean;
  InsuranceModal!: NgbModalRef;
  InsuranceForm!: FormGroup<IInsuranceCompanies>;

  @ViewChild("insuranceContent") insuranceContent!: ElementRef;

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
    private eventService: EventService,
    private modalService: NgbModal,
    private table: MasterTableService,
  ) { }

  ngOnInit (): void
  {
    this.initInsuranceForm();
    this.getLookupData();
  }
  getLookupData ()
  {
    this.lookupData = this.table.getBaseData(MODULES.InsuranceCompanies);
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();
      let sub = this.InsuranceCompaniesService.getInsuranceCompanies().subscribe(
        (res: HttpResponse<IBaseResponse<IInsuranceCompanies[]>>) =>
        {
          this.uiState.list = res.body?.data!;
          params.successCallback(this.uiState.list, this.uiState.list.length);
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

  openInsuranceDialoge (id?: string)
  {
    this.resetInsuranceForm();
    this.InsuranceModal = this.modalService.open(this.insuranceContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "xl",
    });
    if (id)
    {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.InsuranceCompaniesService.getEditInsuranceData(id).subscribe(
        (res: HttpResponse<IBaseResponse<IInsuranceCompaniesData>>) =>
        {
          this.uiState.editInsuranceMode = true;
          this.uiState.editInsuranceData = res.body?.data!;
          this.fillEditInsuranceForm(res.body?.data!);
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

    this.InsuranceModal.hidden.subscribe(() =>
    {
      this.resetInsuranceForm();
      this.InsuranceFormSubmitted = false;
      this.uiState.editInsuranceMode = false;
    });
  }

  initInsuranceForm ()
  {
    this.InsuranceForm = new FormGroup<IInsuranceCompanies>({
      sNo: new FormControl(null),
      companyName: new FormControl(null, Validators.required),
      companyNameAr: new FormControl(null),
      abbreviation: new FormControl(null, Validators.required),
      vatNo: new FormControl(null, Validators.required),
      crNo: new FormControl(null, Validators.required),
      tele1: new FormControl(null),
      fax: new FormControl(null),
      unifiedNo: new FormControl(null),
      email: new FormControl(null, Validators.email),
      address: new FormControl(null),
      otherDetails: new FormControl(null),
      productsList: new FormArray<FormGroup<IProductsList>>([]),
      contactList: new FormArray<FormGroup<IContactList>>([]),
    })
  }

  //#get edit form controls
  get f ()
  {
    return this.InsuranceForm.controls;
  }

  //#products List Array 
  get productsListArray (): FormArray
  {
    return this.InsuranceForm.get("productsList") as FormArray;
  }

  //get products List Controls
  productsLisControls (i: number, control: string): AbstractControl
  {
    return this.productsListArray.controls[ i ].get(control)!;
  }
  //#contact List Array
  get contactListArray (): FormArray
  {
    return this.InsuranceForm.get("contactList") as FormArray;
  }

  //get contact List Controls
  contactListControls (i: number, control: string): AbstractControl
  {
    return this.contactListArray.controls[ i ].get(control)!;
  }

  addProduct (data?: IProductsList)
  {
    if (this.f.productsList?.invalid)
    {
      this.f.productsList?.markAllAsTouched();
      return;
    }
    let product = new FormGroup<IProductsList>({
      classOfBusiness: new FormControl(data?.classOfBusiness || null),
      lineOfBusiness: new FormControl(data?.lineOfBusiness || null),
    });

    if (!data) product.reset();
    else product.disable();

    this.f.productsList?.push(product);
    this.productsListArray.updateValueAndValidity();
  }

  addContact (data?: IContactList)
  {
    if (this.f.contactList?.invalid)
    {
      this.f.contactList?.markAllAsTouched();
      return;
    }
    let contact = new FormGroup<IContactList>({
      contactName: new FormControl(data?.contactName || null),
      contactPosition: new FormControl(data?.contactPosition || null),
      contactEmail: new FormControl(data?.contactEmail || null),
      contactMobileNo: new FormControl(data?.contactMobileNo || null),
      contactTele: new FormControl(data?.contactTele || null),
      LineOfBusiness: new FormControl(data?.LineOfBusiness || null),
      department: new FormControl(data?.department || null),
      address: new FormControl(data?.address || null),
    });

    if (!data) contact.reset();
    else contact.disable();

    this.f.contactList?.push(contact);
    this.contactListArray.updateValueAndValidity();
  }

  remove (i: number, type: string)
  {
    if (type === "product") this.productsListArray.removeAt(i);
    else if (type === "contact") this.contactListArray.removeAt(i);
    else return;
  }

  enableEditingRow (i: number, type: string)
  {
    if (type === "product") this.productsListArray.at(i).enable();
    else if (type === "contact") this.contactListArray.at(i).enable();
    else return;
  }
  //#endregion


  fillAddIsnuranceForm (data: IInsuranceCompaniesData)
  {
    this.f.companyName?.patchValue(data.companyName!);
    this.f.companyNameAr?.patchValue(data.companyNameAr!);
    this.f.abbreviation?.patchValue(data.abbreviation!);
    this.f.vatNo?.patchValue(data.vatNo!);
    this.f.crNo?.patchValue(data.crNo!);
    this.f.tele1?.patchValue(data.tele1!);
    this.f.fax?.patchValue(data.fax!);
    this.f.unifiedNo?.patchValue(data.unifiedNo!);
    this.f.email?.patchValue(data.email!);
    this.f.address?.patchValue(data.address!);
    this.f.otherDetails?.patchValue(data.otherDetails!);
    data.productsList?.forEach((sr: any) => this.addProduct(sr));
    data.contactList?.forEach((sr: any) => this.addContact(sr));
  }

  fillEditInsuranceForm (data: IInsuranceCompaniesData)
  {

    this.f.companyName?.patchValue(data.companyName!);
    this.f.companyNameAr?.patchValue(data.companyNameAr!);
    this.f.abbreviation?.patchValue(data.abbreviation!);
    this.f.vatNo?.patchValue(data.vatNo!);
    this.f.crNo?.patchValue(data.crNo!);
    this.f.tele1?.patchValue(data.tele1!);
    this.f.fax?.patchValue(data.fax!);
    this.f.unifiedNo?.patchValue(data.unifiedNo!);
    this.f.email?.patchValue(data.email!);
    this.f.address?.patchValue(data.address!);
    this.f.otherDetails?.patchValue(data.otherDetails!);
    data.productsList?.forEach((sr: any) => this.addProduct(sr));
    data.contactList?.forEach((sr: any) => this.addContact(sr));
  }

  validationChecker (): boolean
  {
    if (this.InsuranceForm.invalid)
    {
      this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
      return false;
    }
    return true;
  }

  submitInsuranceData (form: FormGroup)
  {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IInsuranceCompaniesData = {
      sNo: this.uiState.editInsuranceMode ? this.uiState.editInsuranceData.sNo : 0,
      companyName: formData.companyName,
      companyNameAr: formData.companyNameAr,
      abbreviation: formData.abbreviation,
      vatNo: formData.vatNo,
      crNo: formData.crNo,
      tele1: formData.tele1,
      fax: formData.fax,
      unifiedNo: formData.unifiedNo,
      email: formData.email,
      address: formData.address,
      otherDetails: formData.otherDetails,
      productsList: formData.productsList,
      contactList: formData.contactList,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.InsuranceCompaniesService.saveInsuranceClass(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) =>
      {
        this.InsuranceModal.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetInsuranceForm();
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

  resetInsuranceForm ()
  {
    this.InsuranceForm.reset();
    this.contactListArray.clear();
    this.productsListArray.clear();
  }

  DeleteInsurance (id: string)
  {
    let sub = this.InsuranceCompaniesService.DeleteInsurance(id).subscribe(
      (res: HttpResponse<IBaseResponse<any>>) =>
      {
        this.gridApi.setDatasource(this.dataSource);
        if (res.body?.status) this.message.toast(res.body!.message!, "success");
        else this.message.toast(res.body!.message!, "error");
      },
      (err: HttpErrorResponse) =>
      {
        this.message.popup("Oops!", err.message, "error");
      }
    );
    this.subscribes.push(sub);
  }

  ngOnDestroy (): void
  {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }

}
