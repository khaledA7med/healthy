import { Component, OnDestroy, OnInit } from "@angular/core";
import { EventService } from "src/app/core/services/event.service";
import { Subscription } from "rxjs";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { reserved } from "src/app/core/models/reservedWord";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ComplaintSettingsService } from "src/app/shared/services/master-tables/customer-service/complaint-settings.service";
import {
  IComplaintSettings,
  IComplaintSettingsData,
} from "src/app/shared/app/models/MasterTables/customer-service/i-complaint-settings";

@Component({
  selector: "app-complaints-settings",
  templateUrl: "./complaints-settings.component.html",
  styleUrls: ["./complaints-settings.component.scss"],
})
export class ComplaintsSettingsComponent implements OnInit, OnDestroy {
  ComplaintsSettingsFormSubmitted = false as boolean;
  ComplaintsSettingsForm!: FormGroup<IComplaintSettings>;
  subscribes: Subscription[] = [];

  uiState = {
    gridReady: false,
    submitted: false,
    editComplaintSettingsMode: false as Boolean,
    complaintSettingsData: {} as IComplaintSettingsData,
    data: [] as IComplaintSettings[],
  };

  constructor(
    private ComplaintSettingsService: ComplaintSettingsService,
    private message: MessagesService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getComplaintSettings();
    this.initComplaintsSettingsForm();
  }

  initComplaintsSettingsForm() {
    this.ComplaintsSettingsForm = new FormGroup<IComplaintSettings>({
      compalintDeadLine: new FormControl(null, Validators.required),
      reminderDays: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.ComplaintsSettingsForm.controls;
  }

  validationChecker(): boolean {
    if (this.ComplaintsSettingsForm.invalid) {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  getComplaintSettings() {
    this.eventService.broadcast(reserved.isLoading, true);
    let sub = this.ComplaintSettingsService.getComplaintSettings().subscribe(
      (res: IBaseResponse<IComplaintSettingsData>) => {
        if (res?.status) {
          this.uiState.editComplaintSettingsMode = true;
          this.uiState.complaintSettingsData = res.data!;
          this.ComplaintsSettingsForm.patchValue({
            ...this.uiState.complaintSettingsData,
          });
        } else this.message.toast(res.message!, "error");
        this.eventService.broadcast(reserved.isLoading, false);
      }
    );
    this.subscribes.push(sub);
  }

  submitComplaintsSettingsData(form: FormGroup<IComplaintSettings>) {
    this.uiState.submitted = true;
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    const data: IComplaintSettingsData = {
      ...form.getRawValue(),
    };
    let sub = this.ComplaintSettingsService.saveComplaintSettings(
      data
    ).subscribe((res: IBaseResponse<any>) => {
      if (res.status) {
        this.message.toast(res.message!, "success");
      } else this.message.popup("Sorry!", res.message!, "warning");
      this.eventService.broadcast(reserved.isLoading, false);
    });
    this.subscribes.push(sub);
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
