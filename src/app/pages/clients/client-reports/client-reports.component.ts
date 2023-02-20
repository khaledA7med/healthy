import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBaseMasterTable } from 'src/app/core/models/masterTableModels';
import { MODULES } from 'src/app/core/models/MODULES';
import { reserved } from 'src/app/core/models/reservedWord';
import { EventService } from 'src/app/core/services/event.service';
import { MasterTableService } from 'src/app/core/services/master-table.service';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { IClientReportFilters } from 'src/app/shared/app/models/Clients/iclient-reoprt-filters';
import { AppRoutes } from 'src/app/shared/app/routers/appRouters';
import AppUtils from 'src/app/shared/app/util';
import { ClientsService } from 'src/app/shared/services/clients/clients.service';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-client-reports',
  templateUrl: './client-reports.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './client-reports.component.scss' ]
})
export class ClientReportsComponent implements OnInit
{


  closeResult!: string;
  url!: string;

  filterForms!: FormGroup<IClientReportFilters>;
  submitted: boolean = false;
  lookupData!: Observable<IBaseMasterTable>;

  subscribes: Subscription[] = [];
  uiState: any;

  constructor (
    private modalService: NgbModal,
    private ClientsService: ClientsService,
    private message: MessagesService,
    private table: MasterTableService,
    private util: AppUtils,
    private router: Router,
    private eventService: EventService

  ) { }

  ngOnInit (): void
  {
    this.initFilterForm();
    this.lookupData = this.table.getBaseData(MODULES.Client);
  }


  initFilterForm (): void
  {
    this.filterForms = new FormGroup<IClientReportFilters>({
      status: new FormControl([ "Active" ]),
      name: new FormControl(""),
      accountNumber: new FormControl(""),
      crNO: new FormControl(""),
      producer: new FormControl("", Validators.required),
      type: new FormControl(""),
      branchs: new FormControl([]),
      minDate: new FormControl(null, Validators.required),
      maxDate: new FormControl(null, Validators.required),
    });
  }

  resetForm (): void
  {
    this.filterForms.reset();
    this.submitted = false;
  }


  get f ()
  {
    return this.filterForms.controls
  }

  onSubmit (filterForm: FormGroup<IClientReportFilters>)
  {
    this.submitted = true;

    // Display Submitting Loader
    this.eventService.broadcast(reserved.isLoading, true);

    let sub = this.ClientsService.viewReport(filterForm.value).subscribe(
      (res: HttpResponse<IBaseResponse<any>>) =>
      {
        if (res.body?.status)
        {
          if (this.filterForms?.invalid)
          {
            this.message.toast("Enter required data");
          } else
          {
            this.message.toast(res.body.message!, "success");
            this.url = res.body.data
            this.resetForm();
          }
        } else this.message.popup("Sorry!", res.body?.message!, "warning");
        // Hide Loader
        this.eventService.broadcast(reserved.isLoading, false);
      },
      (err) => this.message.popup("Sorry!", err.message!, "error")
    );
    this.subscribes.push(sub);
  }

  openFullscreen (content: any)
  {
    this.modalService.open(content, { fullscreen: true });
  }

}
