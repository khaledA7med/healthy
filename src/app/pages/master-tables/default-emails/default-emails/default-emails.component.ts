import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { EventService } from "src/app/core/services/event.service";
import { Observable, Subscription } from "rxjs";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { reserved } from "src/app/core/models/reservedWord";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { DefaultEmailsService } from "src/app/shared/services/master-tables/default-emails.service";
import {
  IDefaultEmails,
  IDefaultEmailsData,
} from "src/app/shared/app/models/MasterTables/i-default-emails";

@Component({
  selector: "app-default-emails",
  templateUrl: "./default-emails.component.html",
  styleUrls: ["./default-emails.component.scss"],
})
export class DefaultEmailsComponent implements OnInit, OnDestroy {
  lookupData!: Observable<IBaseMasterTable>;
  DefaultEmailsFormSubmitted = false as boolean;
  DefaultEmailsForm!: FormGroup<IDefaultEmails>;

  uiState = {
    submitted: false as Boolean,
    getDefaultEmailsMode: false as Boolean,
    getDefaultEmailsData: {} as IDefaultEmailsData,
    category: "Claims - Clients",
  };
  subscribes: Subscription[] = [];

  getDefaultEmails(category: string): void {
    let sub = this.DefaultEmailsService.getDefaultEmails(category).subscribe(
      (res: HttpResponse<IBaseResponse<IDefaultEmailsData>>) => {
        if (res.body?.status) {
          this.uiState.getDefaultEmailsMode = true;
          this.uiState.getDefaultEmailsData = res.body?.data!;
          this.f.category?.patchValue(
            this.uiState.getDefaultEmailsData.category!
          );
          this.f.item?.patchValue(this.uiState.getDefaultEmailsData.item!);
        } else this.message.toast(res.body?.message!, "error");
        this.eventService.broadcast(reserved.isLoading, false);
      }
    );
    this.subscribes.push(sub);
  }

  constructor(
    private DefaultEmailsService: DefaultEmailsService,
    private message: MessagesService,
    private table: MasterTableService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.initDefaultEmailsForm();
    this.f.category?.patchValue(this.uiState.category);
    this.getDefaultEmails(this.uiState.category);
    this.getLookupData();
  }

  getLookupData() {
    this.lookupData = this.table.getBaseData(MODULES.DefaultEmails);
  }

  initDefaultEmailsForm() {
    this.DefaultEmailsForm = new FormGroup<IDefaultEmails>({
      category: new FormControl(null, Validators.required),
      item: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.DefaultEmailsForm.controls;
  }

  validationChecker(): boolean {
    if (this.DefaultEmailsForm.invalid) {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  filter(e: any) {
    this.uiState.category = e?.name;
    this.getDefaultEmails(this.uiState.category);
  }

  submitDefaultEmailsData(form: FormGroup<IDefaultEmails>) {
    this.uiState.submitted = true;
    if (!this.validationChecker()) return;
    const data: IDefaultEmailsData = {
      ...form.getRawValue(),
    };
    let sub = this.DefaultEmailsService.saveDefaultEmails(data).subscribe(
      (res: IBaseResponse<any>) => {
        if (res?.status) {
          this.message.toast(res.message!, "success");
          this.getDefaultEmails(this.uiState.category);
        } else this.message.popup("Sorry!", res.message!, "warning");
        this.eventService.broadcast(reserved.isLoading, false);
      }
    );
    this.subscribes.push(sub);
  }

  resetDefaultEmailsForm() {
    this.DefaultEmailsForm.reset();
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
