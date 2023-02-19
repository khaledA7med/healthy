import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
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

@Component({
  selector: 'app-client-reports',
  templateUrl: './client-reports.component.html',
  styleUrls: [ './client-reports.component.scss' ]
})
export class ClientReportsComponent implements OnInit
{

  filterForms!: FormGroup<IClientReportFilters>;
  submitted: boolean = false;
  lookupData!: Observable<IBaseMasterTable>;

  subscribes: Subscription[] = [];
  util: any;
  uiState: any;

  constructor (
    private ClientsService: ClientsService,
    private message: MessagesService,
    private table: MasterTableService,
    private appUtils: AppUtils,
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
      status: new FormControl([]),
      name: new FormControl(null),
      accountNumber: new FormControl(null),
      crNO: new FormControl(null),
      producer: new FormControl(null, Validators.required),
      type: new FormControl(null),
      branchs: new FormControl([]),
      minDate: new FormControl(null),
      maxDate: new FormControl(null),
    });
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

    const formData = new FormData();

    formData.append("accountNumber", filterForm.value.accountNumber!);
    formData.append("crNO", filterForm.value.crNO!);
    formData.append("name", filterForm.value.name!);
    formData.append("producer", filterForm.value.producer!);
    formData.append("type", filterForm.value.type!);
    for (let status of filterForm.value.status!)
    {
      formData.append('status', status);
    }
    for (let branchs of filterForm.value.branchs!)
    {
      formData.append('status', branchs);
    }
    formData.append(
      "minDate",
      this.util.dateFormater(filterForm.value.minDate!)
    );
    formData.append(
      "maxDate",
      this.util.dateFormater(filterForm.value.maxDate!)
    );
    let sub = this.ClientsService.viewReport(formData).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) =>
      {
        if (res.body?.status)
        {
          this.message.toast(res.body.message!, "success");
          if (this.uiState.editId)
            this.router.navigate([ AppRoutes.Client.base ]);
        } else this.message.popup("Sorry!", res.body?.message!, "warning");
        // Hide Loader
        this.eventService.broadcast(reserved.isLoading, false);
      },
      (err) => this.message.popup("Sorry!", err.message!, "error")
    );
    this.subscribes.push(sub);
  }
}
