import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import {
  IBaseMasterTable,
  IGenericResponseType,
} from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { ITasks } from "../../app/models/Activities/itasks";
import { ITasksForm } from "../../app/models/Activities/itasks-form";
import { IBaseResponse } from "../../app/models/App/IBaseResponse";
import { ISalesLeadDetails } from "../../app/models/BusinessDevelopment/isalesLeadDetails";
import { IClaims } from "../../app/models/Claims/iclaims";
import { ICustomerService } from "../../app/models/CustomerService/icustomer-service";
import AppUtils from "../../app/util";
import { ActivitiesService } from "../../services/activities/activities.service";
import { MessagesService } from "../../services/messages.service";

@Component({
  selector: "app-new-task",
  templateUrl: "./new-task.component.html",
  styleUrls: ["./new-task.component.scss"],
})
export class NewTaskComponent implements OnInit, OnDestroy {
  uiState = {
    editMode: false as boolean,
    submitted: false as boolean,
    isRange: false as boolean,
    isLoading: false as boolean,
    lists: {
      clients: [] as IGenericResponseType[],
      module: [] as any[],
      assignTo: [] as any,
    },
  };

  formGroup!: FormGroup<ITasksForm>;
  formData!: Observable<IBaseMasterTable>;
  subscribes: Subscription[] = [];

  @Input() clickedDate!: any;

  @Input() task!: ITasks;

  constructor(
    public modal: NgbActiveModal,
    private activityService: ActivitiesService,
    private util: AppUtils,
    private message: MessagesService,
    private tables: MasterTableService
  ) {}

  initForm(): void {
    this.formGroup = new FormGroup<ITasksForm>({
      id: new FormControl(null), // moduleSNo,
      title: new FormControl(null), // updatedTitle,
      start: new FormControl(null, Validators.required), // start_date,
      end: new FormControl(null, Validators.required), // end_date,
      description: new FormControl(null), // eventDescription,
      isAllDay: new FormControl(false), // all_day,
      module: new FormControl(null, Validators.required), // updatedModule,
      moduleSNo: new FormControl(null), // moduleSNo,
      type: new FormControl(null, Validators.required), // updatedType,
      dueDateFrom: new FormControl(null), // start_date.toJSON(),
      dueDateTo: new FormControl(null), // end_date?.toJSON(),
      timeStampFrom: new FormControl(null, Validators.required), // (start_date.getTime() / 1000),
      timeStampTo: new FormControl(null, Validators.required), // (end_date.getTime() / 1000),
      status: new FormControl(null), // '',
      taskName: new FormControl(null, Validators.required), // updatedTitle,
      taskDetails: new FormControl(null), // eventDescription,
      taskClosingNotes: new FormControl(null), // '',
      assignedTo: new FormControl(null, Validators.required), // updatedAssignTo,
      clientName: new FormControl(null), // updatedClientName

      startTime: new FormControl(null, Validators.required),
      endTime: new FormControl(null, Validators.required),

      sNo: new FormControl(null), // eventid,
    });
  }

  get f(): ITasksForm {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.initForm();
    this.formData = this.tables.getBaseData(MODULES.Activities);
    if (this.task?.sNo) this.fillTaskData();
    let sub = this.formData.subscribe(
      (res) =>
        (this.uiState.lists.assignTo = res.Producers?.content.filter(
          (el) => !el.name.startsWith("Direct Business")
        ))
    );
    this.subscribes.push(sub);
    if (this.clickedDate) {
      this.uiState.isRange = true;
      this.f.start?.patchValue(this.clickedDate?.dueDateFrom);
      this.f.end?.patchValue(this.clickedDate?.dueDateTo);
      this.f.startTime?.disable();
      this.f.endTime?.disable();
      this.f.isAllDay?.patchValue(true);
    }
  }

  fillTaskData() {
    this.uiState.editMode = true;
    this.clickedDate = {
      dueDateFrom: new Date(this.task?.dueDateFrom!),
      dueDateTo: new Date(this.task?.dueDateTo!),
    };
    if (!this.task.isAllDay) {
      let startTime = new Date(this.task?.dueDateFrom!);
      let endTime = new Date(this.task?.dueDateTo!);
      this.f.startTime?.patchValue(
        `${startTime?.getHours()}:${startTime?.getMinutes()}`
      );
      this.f.endTime?.patchValue(
        `${endTime?.getHours()}:${endTime?.getMinutes()}`
      );
    }
    this.formGroup.patchValue({
      start: this.task.dueDateFrom,
      end: this.task.dueDateTo,
      assignedTo: this.task.assignedTo,
      clientName: this.task.clientName,
      module: this.task.module,
      moduleSNo: +this.task.moduleSNo!,
      taskName: this.task.taskName,
      taskDetails: this.task.taskDetails,
      sNo: +this.task.sNo!,
      isAllDay: this.task.isAllDay,
      type: this.task.type,
    });
    this.getModuleClients(this.task.module!);
    this.searchModule(this.task.clientID!);
  }

  getModuleClients(module: string) {
    this.uiState.lists.clients = [];
    if (!module) return;
    let sub = this.activityService
      .getModuleClients(module)
      .subscribe(
        (res: IBaseResponse<IGenericResponseType[]>) =>
          (this.uiState.lists.clients = res.data!)
      );
    this.subscribes.push(sub);
  }

  searchModule(clientId?: number) {
    this.uiState.lists.module = [];
    if (!clientId || !this.f.module?.value!) return;
    let sub = this.activityService
      .searchModule(this.f.module?.value!, clientId)
      .subscribe((res: IBaseResponse<any>) => {
        if (this.f.module?.value === "Claims")
          this.uiState.lists.module = (res.data as IClaims[])?.map(
            (el: IClaims) => {
              return {
                no: el.sNo,
                mNo: el.claimNo,
                label: `${el.claimNo} | ${el.clientID} | ${el.clientName} | ${
                  el.className
                } | ${el.lineofBusiness} | ${
                  el.policyNo
                } | ${this.util.formatDate(el.dateOfDeadline)}`,
              };
            }
          );
        else if (this.f.module?.value === "Customer Services")
          this.uiState.lists.module = (res.data as ICustomerService[])?.map(
            (el: ICustomerService) => {
              return {
                no: el.sno,
                mNo: el.requestNo,
                label: `${el.requestNo} | ${el.clientId} | ${el.clientName} | ${
                  el.classOfBusiness
                } | ${el.lineOfBusiness} | ${
                  el.policyNo
                } | ${this.util.formatDate(el.existingPolExpDate)}`,
              };
            }
          );
        else if (this.f.module?.value === "SalesLead")
          this.uiState.lists.module = (res.data as ISalesLeadDetails[])?.map(
            (el: ISalesLeadDetails) => {
              return {
                no: el.sNo,
                mNo: el.leadNo,
                label: `${el.leadNo} | ${el.clientID} | ${el.name} | ${
                  el.classOfBusiness
                } | ${el.lineOfBusiness} | ${
                  el.producer
                } | ${this.util.formatDate(el.deadline)}`,
              };
            }
          );
      });
    this.subscribes.push(sub);
  }

  setDate(e: { from?: NgbDate; to?: NgbDate; range?: boolean }) {
    if (e.range) {
      this.uiState.isRange = true;
      this.f.startTime?.disable();
      this.f.endTime?.disable();
      this.f.isAllDay?.patchValue(true);
    } else {
      this.uiState.isRange = false;
      this.f.startTime?.enable();
      this.f.endTime?.enable();
      this.f.isAllDay?.patchValue(false);
    }
    this.f.start?.patchValue(this.util.dateFormater(e?.from!) as any);
    this.f.end?.patchValue(this.util.dateFormater(e?.to!) as any);
  }

  datesHandler(): void {
    if (this.uiState.isRange) {
      let start = new Date(this.f.start?.value!).getTime() / 1000,
        end = new Date(this.f.end?.value!).getTime() / 1000;
      this.f.timeStampFrom?.patchValue(+start!);
      this.f.timeStampTo?.patchValue(+end!);
    } else {
      let start = this.f.start?.value,
        end = this.f.end?.value,
        startTime = this.f.startTime?.value,
        endTime = this.f.endTime?.value;
      start = new Date(start + " " + startTime);
      end = new Date(end + " " + endTime);
      this.f.timeStampFrom?.patchValue(start.getTime() / 1000);
      this.f.timeStampTo?.patchValue(end.getTime() / 1000);
    }
  }

  onSubmit() {
    this.uiState.submitted = true;
    this.datesHandler();
    if (!this.validationChecker()) return;
    this.uiState.isLoading = true;

    let val = this.formGroup.getRawValue();

    let data: ITasks = {
      sNo: val.sNo ? +val.sNo! : 0,
      module: val.module!,
      moduleSNo: +val.moduleSNo!,
      taskName: val.taskName!,
      type: val.type!,
      timeStampFrom: val.timeStampFrom!.toString(),
      timeStampTo: val.timeStampTo!.toString(),
      isAllDay: val.isAllDay!,
      status: "Open",
      taskDetails: val.taskDetails!,
      assignedTo: val.assignedTo!,
      clientName: val.clientName!,
    };

    let sub = this.activityService.addTask(data).subscribe((res) => {
      if (res.status) {
        this.modal.close();
        this.message.toast(res.message, "success");
      } else this.message.popup("Oops!", res.message, "warning");
      this.uiState.isLoading = false;
    });
    this.subscribes.push(sub);
  }

  validationChecker(): boolean {
    if (this.formGroup.invalid) {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((el) => el.unsubscribe());
  }
}
