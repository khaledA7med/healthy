import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import
{
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import
{
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
import { contactsListPositionCols } from "src/app/shared/app/grid/contactsListPositionCols";
import { ContactsListPositionService } from "src/app/shared/services/master-tables/contacts-list-position.service";
import { IContactsListPosition, IContactsListPositionData } from "src/app/shared/app/models/MasterTables/i-contacts-list-position";

@Component({
  selector: 'app-contacts-list-position',
  templateUrl: './contacts-list-position.component.html',
  styleUrls: [ './contacts-list-position.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class ContactsListPositionComponent implements OnInit, OnDestroy
{

  ContactsListPositionFormSubmitted = false as boolean;
  ContactsListPositionModal!: NgbModalRef;
  ContactsListPositionForm!: FormGroup<IContactsListPosition>;
  @ViewChild("ContactsListPositionContent") ContactsListPositionContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as IContactsListPosition[],
    totalPages: 0,
    editContactsListPositionMode: false as Boolean,
    editContactsListPositionData: {} as IContactsListPositionData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi> {};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: contactsListPositionCols,
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
    private ContactsListPositionService: ContactsListPositionService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) { }

  ngOnInit (): void
  {
    this.initContactsListPositionForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();
      let sub = this.ContactsListPositionService.getContactsListPosition().subscribe(
        (res: HttpResponse<IBaseResponse<IContactsListPosition[]>>) =>
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
    this.gridApi.sizeColumnsToFit();
  }

  openContactsListPositionDialoge (id?: string)
  {
    this.resetContactsListPositionForm();
    this.ContactsListPositionModal = this.modalService.open(this.ContactsListPositionContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });
    if (id)
    {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.ContactsListPositionService.getEditContactsListPosition(id).subscribe(
        (res: HttpResponse<IBaseResponse<IContactsListPositionData>>) =>
        {
          this.uiState.editContactsListPositionMode = true;
          this.uiState.editContactsListPositionData = res.body?.data!;
          this.fillAddContactsListPositionForm(res.body?.data!);
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

    this.ContactsListPositionModal.hidden.subscribe(() =>
    {
      this.resetContactsListPositionForm();
      this.ContactsListPositionFormSubmitted = false;
      this.uiState.editContactsListPositionMode = false;
    });
  }


  initContactsListPositionForm ()
  {
    this.ContactsListPositionForm = new FormGroup<IContactsListPosition>({
      sNo: new FormControl(null),
      position: new FormControl(null, Validators.required)
    });
  }

  get f ()
  {
    return this.ContactsListPositionForm.controls;
  }

  fillAddContactsListPositionForm (data: IContactsListPositionData)
  {
    this.f.position?.patchValue(data.position!);
  }

  fillEditContactsListPositionForm (data: IContactsListPositionData)
  {
    this.f.position?.patchValue(data.position!);
  }

  validationChecker (): boolean
  {
    if (this.ContactsListPositionForm.invalid)
    {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  submitContactsListPositionData (form: FormGroup)
  {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IContactsListPositionData = {
      sNo: this.uiState.editContactsListPositionMode
        ? this.uiState.editContactsListPositionData.sNo
        : 0,
      position: formData.position
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.ContactsListPositionService.saveContactsListPosition(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) =>
      {
        this.ContactsListPositionModal.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetContactsListPositionForm();
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

  resetContactsListPositionForm ()
  {
    this.ContactsListPositionForm.reset();
  }

  DeleteContactsListPosition (id: string)
  {
    let sub = this.ContactsListPositionService.DeleteContactsListPosition(id).subscribe(
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
