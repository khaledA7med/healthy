import { Component, OnInit, ViewChild } from '@angular/core';
import AppUtils from 'src/app/shared/app/util';
import { ActivatedRoute, Router } from "@angular/router";
import { MessagesService } from "src/app/shared/services/messages.service";
import
{
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { HttpResponse } from "@angular/common/http";
import { EventService } from "src/app/core/services/event.service";
import { reserved } from "src/app/core/models/reservedWord";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";

@Component({
  selector: 'app-customer-service-forms',
  templateUrl: './customer-service-forms.component.html',
  styleUrls: [ './customer-service-forms.component.scss' ],
  providers: [ AppUtils ],

})
export class CustomerServiceFormsComponent implements OnInit
{

  submitted = false;
  formData!: Observable<IBaseMasterTable>;

  //test ng-select
  vatSelect!: number;
  branchSelect!: string;

  vats = [
    {
      id: 1, name: '0%'
    },
    {
      id: 2, name: '15%'
    }
  ]

  branches = [
    {
      id: 1, name: 'Cairo'
    },
    {
      id: 2, name: 'Riyadh'
    }
  ]



  documentsToUpload: File[] = [];
  docs: any[] = [];

  @ViewChild("dropzone") dropzone!: any;
  subscribes: Subscription[] = [];

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private message: MessagesService,
    private tables: MasterTableService,
    private util: AppUtils,
    private eventService: EventService
  ) { }

  ngOnInit (): void
  {
  }

  documentsList (evt: File[])
  {
    this.documentsToUpload = evt;
  }

  dateFormater (dt: any)
  {
    let date = "";
    if (dt)
    {
      date = new Date(`${ dt.year }/${ dt.month }/${ dt.day }`).toLocaleDateString();
    }
    return date;
  }

  // DeadLineDate(e: { gon: any; }): void {
  //   this.f.deadLineDate?.patchValue(e.gon);
  // }

  ngOnDestroy (): void
  {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
