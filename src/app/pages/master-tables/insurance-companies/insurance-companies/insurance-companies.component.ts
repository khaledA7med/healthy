import { HttpResponse } from "@angular/common/http";
import {
  Component,
  ElementRef,
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
import { EventService } from "src/app/core/services/event.service";
import { Observable, Subscription } from "rxjs";
import {
  Caching,
  IBaseMasterTable,
  IGenericResponseType,
} from "src/app/core/models/masterTableModels";
import { insuranceCompaniesCols } from "src/app/shared/app/grid/insuranceCompaniesCols";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import {
  IInsuranceCompanies,
  IInsuranceCompaniesData,
} from "src/app/shared/app/models/MasterTables/insurance-companies/i-insurance-companies";
import { MasterMethodsService } from "src/app/shared/services/master-methods.service";
import { InsuranceCompaniesService } from "src/app/shared/services/master-tables/insurance-companies.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { reserved } from "src/app/core/models/reservedWord";
import {
  IContactList,
  IContactListData,
} from "src/app/shared/app/models/MasterTables/insurance-companies/i-contact-list";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import {
  IProductsList,
  IProductsListData,
} from "src/app/shared/app/models/MasterTables/insurance-companies/i-products-list";
import { IInsuranceCompaniesPreview } from "src/app/shared/app/models/MasterTables/insurance-companies/i-insurance-companies-preview";

@Component({
  selector: "app-insurance-companies",
  templateUrl: "./insurance-companies.component.html",
  styleUrls: ["./insurance-companies.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InsuranceCompaniesComponent implements OnInit {
  lookupData!: Observable<IBaseMasterTable>;
  subscribes: Subscription[] = [];
  lineOfBussArr: IGenericResponseType[] = [];
  InsuranceFormSubmitted = false as boolean;
  InsuranceModal!: NgbModalRef;
  InsuranceForm!: FormGroup<IInsuranceCompanies>;

  @ViewChild("insuranceContent") insuranceContent!: ElementRef;

  uiState = {
    isLoading: false as boolean,
    gridReady: false,
    submitted: false,
    list: [] as IInsuranceCompanies[],
    totalPages: 0,
    editInsuranceMode: false as Boolean,
    editInsuranceData: {} as IInsuranceCompaniesData,
  };

  gridApi: GridApi = <GridApi>{};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    rowSelection: "single",
    columnDefs: insuranceCompaniesCols,
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
    private masterService: MasterMethodsService,
    private message: MessagesService,
    private InsuranceCompaniesService: InsuranceCompaniesService,
    private eventService: EventService,
    private modalService: NgbModal,
    private table: MasterTableService
  ) {}

  ngOnInit(): void {
    this.initInsuranceForm();
    this.getLookupData();
  }
  getLookupData() {
    this.lookupData = this.table.getBaseData(MODULES.InsuranceCompanies);
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      let sub =
        this.InsuranceCompaniesService.getInsuranceCompanies().subscribe(
          (res: HttpResponse<IBaseResponse<IInsuranceCompanies[]>>) => {
            if (res.body?.status) {
              this.uiState.list = res.body?.data!;
              params.successCallback(
                this.uiState.list,
                this.uiState.list.length
              );
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

  getLineOfBusiness(className: string) {
    let sub = this.masterService
      .getLineOfBusiness(className)
      .subscribe(
        (res: HttpResponse<IBaseResponse<Caching<IGenericResponseType[]>>>) => {
          if (res.body?.status) {
            this.lineOfBussArr = res.body?.data?.content!;
          } else this.message.toast(res.body!.message!, "error");
        }
      );
    this.subscribes.push(sub);
  }

  openInsuranceDialoge(id?: string) {
    this.resetInsuranceForm();
    this.InsuranceModal = this.modalService.open(this.insuranceContent, {
      centered: true,
      backdrop: "static",
      size: "xl",
    });
    if (id) {
      let sub = this.InsuranceCompaniesService.getEditInsuranceCompanies(
        id
      ).subscribe(
        (res: HttpResponse<IBaseResponse<IInsuranceCompaniesPreview>>) => {
          if (res.body?.status) {
            this.uiState.editInsuranceMode = true;
            this.uiState.editInsuranceData = res.body?.data!;
            this.fillEditInsuranceForm(res.body?.data!);
          } else this.message.toast(res.body!.message!, "error");
        }
      );
      this.subscribes.push(sub);
    }

    this.InsuranceModal.hidden.subscribe(() => {
      this.resetInsuranceForm();
      this.InsuranceFormSubmitted = false;
      this.uiState.editInsuranceMode = false;
    });
  }

  initInsuranceForm() {
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
    });
  }

  //#get edit form controls
  get f() {
    return this.InsuranceForm.controls;
  }

  //#products List Array
  get productsListArray(): FormArray {
    return this.InsuranceForm.get("productsList") as FormArray;
  }

  //get products List Controls
  productsListControls(i: number, control: string): AbstractControl {
    return this.productsListArray.controls[i].get(control)!;
  }
  //#contact List Array
  get contactListArray(): FormArray {
    return this.InsuranceForm.get("contactList") as FormArray;
  }

  //get contact List Controls
  contactListControls(i: number, control: string): AbstractControl {
    return this.contactListArray.controls[i].get(control)!;
  }

  addProduct(data?: IProductsListData) {
    if (this.f.productsList?.invalid) {
      this.f.productsList?.markAllAsTouched();
      return;
    }
    let product = new FormGroup<IProductsList>({
      classOfBusiness: new FormControl(
        data?.classOfBusiness || null,
        Validators.required
      ),
      lineOfBusiness: new FormControl(
        data?.lineOfBusiness || null,
        Validators.required
      ),
    });

    if (!data) product.reset();
    else product.disable();

    this.f.productsList?.push(product);
    this.productsListArray.updateValueAndValidity();
  }

  addContact(data?: IContactListData) {
    if (this.f.contactList?.invalid) {
      this.f.contactList?.markAllAsTouched();
      return;
    }
    let contact = new FormGroup<IContactList>({
      contactName: new FormControl(
        data?.contactName || null,
        Validators.required
      ),
      contactPosition: new FormControl(
        data?.contactPosition || null,
        Validators.required
      ),
      contactEmail: new FormControl(data?.contactEmail || null, [
        Validators.email,
        Validators.required,
      ]),
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

  remove(i: number, type: string) {
    if (type === "product") this.productsListArray.removeAt(i);
    else if (type === "contact") this.contactListArray.removeAt(i);
    else return;
  }

  enableEditingRow(i: number, type: string) {
    if (type === "product") this.productsListArray.at(i).enable();
    else if (type === "contact") this.contactListArray.at(i).enable();
    else return;
  }
  //#endregion

  fillEditInsuranceForm(data: IInsuranceCompaniesPreview) {
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
    data.productsList?.forEach((pro) => this.addProduct(pro));
    data.contactList?.forEach((con) => this.addContact(con));
  }

  validationChecker(): boolean {
    if (this.InsuranceForm.invalid) {
      this.message.toast("Please Fill Required Inputs");
      return false;
    }
    return true;
  }

  submitInsuranceData(InsuranceForm: FormGroup<IInsuranceCompanies>) {
    this.uiState.submitted = true;
    if (!this.validationChecker()) return;

    const formData = new FormData();
    let val = InsuranceForm.getRawValue();
    formData.append("sNo", val.sNo?.toString()! ?? 0);
    formData.append("companyName", val.companyName!);
    formData.append("companyNameAr", val.companyNameAr! ?? "");
    formData.append("abbreviation", val.abbreviation!);
    formData.append("vatNo", val.vatNo!);
    formData.append("crNo", val.crNo!);
    formData.append("tele1", val.tele1! ?? "");
    formData.append("fax", val.fax! ?? "");
    formData.append("unifiedNo", val.unifiedNo! ?? "");
    formData.append("email", val.email! ?? "");
    formData.append("address", val.address! ?? "");
    formData.append("otherDetails", val.otherDetails! ?? "");

    let contact = val.contactList!;
    for (let i = 0; i < contact.length; i++) {
      formData.append(`contactList[${i}]`, contact[i].contactName! ?? "");
      formData.append(`contactList[${i}]`, contact[i].contactPosition! ?? "");
      formData.append(`contactList[${i}]`, contact[i].contactEmail! ?? "");
      formData.append(`contactList[${i}]`, contact[i].contactMobileNo! ?? "");
      formData.append(`contactList[${i}]`, contact[i].contactTele! ?? "");
      formData.append(`contactList[${i}]`, contact[i].LineOfBusiness! ?? "");
      formData.append(`contactList[${i}]`, contact[i].department! ?? "");
      formData.append(`contactList[${i}]`, contact[i].address! ?? "");
    }

    let product = val.productsList!;
    for (let i = 0; i < product.length; i++) {
      formData.append(`productsList[${i}]`, product[i].classOfBusiness! ?? "");
      formData.append(`productsList[${i}]`, product[i].lineOfBusiness! ?? "");
    }

    if (!this.validationChecker()) return;

    let sub = this.InsuranceCompaniesService.saveInsuranceCompanies(
      formData
    ).subscribe((res: HttpResponse<IBaseResponse<number>>) => {
      if (res.body?.status) {
        this.InsuranceModal.dismiss();
        this.uiState.submitted = false;
        this.resetInsuranceForm();
        this.gridApi.setDatasource(this.dataSource);
        this.message.toast(res.body?.message!, "success");
      } else this.message.toast(res.body!.message!, "error");
    });
    this.subscribes.push(sub);
  }

  resetInsuranceForm() {
    this.InsuranceForm.reset();
    this.contactListArray.clear();
    this.productsListArray.clear();
  }

  DeleteInsurance(id: string) {
    let sub = this.InsuranceCompaniesService.DeleteInsuranceCompanies(
      id
    ).subscribe((res: HttpResponse<IBaseResponse<any>>) => {
      if (res.body?.status) {
        this.gridApi.setDatasource(this.dataSource);
        if (res.body?.status) this.message.toast(res.body!.message!, "success");
        else this.message.toast(res.body!.message!, "error");
      } else this.message.toast(res.body!.message!, "error");
    });
    this.subscribes.push(sub);
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
