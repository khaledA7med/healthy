import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CellEvent, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import { EventService } from "src/app/core/services/event.service";
import { Subscription } from 'rxjs';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { reserved } from 'src/app/core/models/reservedWord';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { locationsCols } from 'src/app/shared/app/grid/locationsCols';
import { LocationsService } from 'src/app/shared/services/master-tables/locations.service';
import { ILocations, ILocationsData } from 'src/app/shared/app/models/MasterTables/i-locations';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: [ './locations.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class LocationsComponent implements OnInit, OnDestroy
{

  LocationsFormSubmitted = false as boolean;
  LocationsModal!: NgbModalRef;
  LocationsForm!: FormGroup<ILocations>;
  @ViewChild("LocationsContent") LocationsContent!: TemplateRef<any>;

  uiState = {
    gridReady: false,
    submitted: false,
    list: [] as ILocations[],
    totalPages: 0,
    editLocationsMode: false as Boolean,
    editLocationsData: {} as ILocationsData,
  };

  subscribes: Subscription[] = [];

  gridApi: GridApi = <GridApi> {};
  gridOpts: GridOptions = {
    rowModelType: "infinite",
    editType: "fullRow",
    animateRows: true,
    columnDefs: locationsCols,
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
    private LocationsService: LocationsService,
    private message: MessagesService,
    private eventService: EventService,
    private modalService: NgbModal
  ) { }

  ngOnInit (): void
  {
    this.initLocationsForm();
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) =>
    {
      this.gridApi.showLoadingOverlay();
      let sub = this.LocationsService.getLocations().subscribe(
        (res: HttpResponse<IBaseResponse<ILocations[]>>) =>
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

  openLocationsDialoge (id?: string)
  {
    this.resetLocationsForm();
    this.LocationsModal = this.modalService.open(this.LocationsContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      size: "md",
    });
    if (id)
    {
      this.eventService.broadcast(reserved.isLoading, true);
      let sub = this.LocationsService.getEditLocations(id).subscribe(
        (res: HttpResponse<IBaseResponse<ILocationsData>>) =>
        {
          this.uiState.editLocationsMode = true;
          this.uiState.editLocationsData = res.body?.data!;
          this.fillAddLocationsForm(res.body?.data!);
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

    this.LocationsModal.hidden.subscribe(() =>
    {
      this.resetLocationsForm();
      this.LocationsFormSubmitted = false;
      this.uiState.editLocationsMode = false;
    });
  }

  initLocationsForm ()
  {
    this.LocationsForm = new FormGroup<ILocations>({
      sno: new FormControl(null),
      locationName: new FormControl(null, Validators.required),
    })
  }

  get f ()
  {
    return this.LocationsForm.controls;
  }

  fillAddLocationsForm (data: ILocationsData)
  {
    this.f.locationName?.patchValue(data.locationName!);
  }

  fillEditLocationsForm (data: ILocationsData)
  {
    this.f.locationName?.patchValue(data.locationName!);
  }

  validationChecker (): boolean
  {
    if (this.LocationsForm.invalid)
    {
      this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
      return false;
    }
    return true;
  }

  submitLocationsData (form: FormGroup)
  {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: ILocationsData = {
      sno: this.uiState.editLocationsMode ? this.uiState.editLocationsData.sno : 0,
      locationName: formData.locationName,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.LocationsService.saveLocations(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) =>
      {
        this.LocationsModal.dismiss();
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetLocationsForm();
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

  resetLocationsForm ()
  {
    this.LocationsForm.reset();
  }

  DeleteLocations (id: string)
  {
    let sub = this.LocationsService.DeleteLocations(id).subscribe(
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
