import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventService } from "src/app/core/services/event.service";
import { Subscription } from 'rxjs';
import { IBaseResponse } from 'src/app/shared/app/models/App/IBaseResponse';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { reserved } from 'src/app/core/models/reservedWord';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComplaintSettingsService } from 'src/app/shared/services/master-tables/customer-service/complaint-settings.service';
import { IComplaintSettings, IComplaintSettingsData } from 'src/app/shared/app/models/MasterTables/customer-service/i-complaint-settings';

@Component({
  selector: 'app-complaints-settings',
  templateUrl: './complaints-settings.component.html',
  styleUrls: [ './complaints-settings.component.scss' ]
})
export class ComplaintsSettingsComponent implements OnInit, OnDestroy
{

  ComplaintsSettingsFormSubmitted = false as boolean;
  ComplaintsSettingsForm!: FormGroup<IComplaintSettings>;
  subscribes: Subscription[] = [];

  uiState = {
    gridReady: false,
    submitted: false,
    complaintSettingsData: {} as IComplaintSettingsData[],
    data: [] as IComplaintSettings[]

  };
  complaintSettingsData = {} as IComplaintSettingsData[];

  constructor (
    private ComplaintSettingsService: ComplaintSettingsService,
    private message: MessagesService,
    private eventService: EventService,
  ) { }

  ngOnInit (): void
  {
    this.getComplaintSettings();
    this.initComplaintsSettingsForm();
  }

  initComplaintsSettingsForm ()
  {
    this.ComplaintsSettingsForm = new FormGroup<IComplaintSettings>({
      compalintDeadLine: new FormControl(null, Validators.required),
      reminderDays: new FormControl(null, Validators.required),
    })
  }

  get f ()
  {
    return this.ComplaintsSettingsForm.controls;
  }

  fillAddComplaintsSettingsForm (data: IComplaintSettingsData)
  {
    this.f.compalintDeadLine?.patchValue(data.compalintDeadLine!);
    this.f.reminderDays?.patchValue(data.reminderDays!);
  }

  fillEditComplaintsSettingsForm (data: IComplaintSettingsData)
  {
    this.f.compalintDeadLine?.patchValue(data.compalintDeadLine!);
    this.f.reminderDays?.patchValue(data.reminderDays!);
  }

  validationChecker (): boolean
  {
    if (this.ComplaintsSettingsForm.invalid)
    {
      this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
      return false;
    }
    return true;
  }

  getComplaintSettings ()
  {
    let sub = this.ComplaintSettingsService.getComplaintSettings().subscribe(
      (res: HttpResponse<IBaseResponse<IComplaintSettingsData>>) =>
      {
        this.eventService.broadcast(reserved.isLoading, true);
        this.fillEditComplaintsSettingsForm(res.body?.data!)
        this.eventService.broadcast(reserved.isLoading, false);
      },
      (err: HttpErrorResponse) =>
      {
        this.message.popup("Oops!", err.error?.message, "error");
        this.eventService.broadcast(reserved.isLoading, false);
      }
    );
    this.subscribes.push(sub);
  }

  submitComplaintsSettingsData (form: FormGroup)
  {
    this.uiState.submitted = true;
    const formData = form.getRawValue();
    const data: IComplaintSettings = {
      compalintDeadLine: formData.compalintDeadLine,
      reminderDays: formData.reminderDays,
    };
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.ComplaintSettingsService.saveComplaintSettings(data).subscribe(
      (res: HttpResponse<IBaseResponse<number>>) =>
      {
        this.eventService.broadcast(reserved.isLoading, false);
        this.uiState.submitted = false;
        this.resetComplaintsSettingsForm();
        this.message.toast(res.body?.message!, "success");
      },
      (err: HttpErrorResponse) =>
      {
        this.message.popup("Oops!", err.error?.message, "error");
        this.eventService.broadcast(reserved.isLoading, false);
      }
    );
    this.subscribes.push(sub);
  }

  resetComplaintsSettingsForm ()
  {
    this.ComplaintsSettingsForm.reset();
  }

  ngOnDestroy (): void
  {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
