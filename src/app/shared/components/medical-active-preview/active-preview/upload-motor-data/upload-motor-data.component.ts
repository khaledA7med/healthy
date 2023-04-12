import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { EventService } from "src/app/core/services/event.service";
import { IActiveList } from "src/app/shared/app/models/Production/i-active-list";
import {
  IMotorData,
  MotorData,
  MotorDataForm,
} from "src/app/shared/app/models/Production/i-active-motor-forms";
import { IMotorActiveDataPreview } from "src/app/shared/app/models/Production/i-motor-active-preview";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";
import readXlsxFile from "read-excel-file";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import AppUtils from "src/app/shared/app/util";
import { reserved } from "src/app/core/models/reservedWord";

@Component({
  selector: "app-upload-motor-data",
  templateUrl: "./upload-motor-data.component.html",
  styleUrls: ["./upload-motor-data.component.scss"],
})
export class UploadMotorDataComponent implements OnInit {
  @Input() data!: {
    id: string;
    className: string;
    clientID: number;
    oasisPOlRef: string;
    PoliciesSno: number;
    PolicyNo: string;
  };
  uiState = {
    policiesSNo: 0,
    submitted: false,
    motorActiveData: {} as IMotorActiveDataPreview,
    motorData: [] as MotorData[],
    loadedData: false,
    updatedState: false,
    data: [] as any[],
    ActiveData: [] as IActiveList[],
    documentList: [],
    privileges: ProductionPermissions,
  };
  subscribes: Subscription[] = [];

  @ViewChild("fileInput") fileInput!: ElementRef;

  MotorDataArr: FormArray<FormGroup<MotorDataForm>> = new FormArray<
    FormGroup<MotorDataForm>
  >([]);
  addMotor(data?: MotorData) {
    let newData = new FormGroup<MotorDataForm>({
      ownerDriver: new FormControl(data?.ownerDriver || null),
      plateNo: new FormControl(data?.plateNo || null),
      plateChar1: new FormControl(data?.plateChar1 || null),
      plateChar2: new FormControl(data?.plateChar2 || null),
      plateChar3: new FormControl(data?.plateChar3 || null),
      sequenceNo: new FormControl(
        data?.sequenceNo || null,
        Validators.required
      ),
      customID: new FormControl(data?.customID || null),
      brandName: new FormControl(data?.brandName || null),
      model: new FormControl(data?.model || null),
      inception: new FormControl(
        (this.appUtils.dateStructFormat(data?.inception!) as any) || null
      ),
      expiry: new FormControl(
        (this.appUtils.dateStructFormat(data?.expiry!) as any) || null
      ),
      kclDate: new FormControl(
        (this.appUtils.dateStructFormat(data?.kclDate!) as any) || null
      ),
      seats: new FormControl(data?.seats || null),
      bodyType: new FormControl(data?.bodyType || null),
      chassisNo: new FormControl(data?.chassisNo || null, Validators.required),
      marketValue: new FormControl(data?.marketValue || null),
      repairType: new FormControl(data?.repairType || null),
      vehicleOwnerID: new FormControl(data?.vehicleOwnerID || null),
      projectName: new FormControl(data?.projectName || null),
    });
    this.MotorDataArr?.push(newData);
  }

  MotorDataArrControls(i: number, control: string): AbstractControl {
    return this.MotorDataArr.controls[i].get(control)!;
  }

  Dates(e: any, i: any, control: string) {
    this.MotorDataArrControls(i, control).patchValue(e.gon);
  }

  removeMedical(i: number) {
    this.MotorDataArr.removeAt(i);
  }
  resetMotorDataArr() {
    this.MotorDataArr.clear();
    this.uiState.data.forEach((newData: any) => this.addMotor(newData));
  }
  clearMotorDataArr() {
    this.MotorDataArr.reset();
    this.MotorDataArr.clear();
    this.fileInput.nativeElement.value = "";
  }
  constructor(
    private message: MessagesService,
    private productinService: ProductionService,
    public modal: NgbActiveModal,
    private appUtils: AppUtils,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getMotorActiveData();
  }

  getMotorActiveData() {
    let sub = this.productinService
      .getMotorDataById(String(this.data.PoliciesSno))
      .subscribe({
        next: (res: IBaseResponse<MotorData[]>) => {
          if (res.status) {
            this.uiState.loadedData = true;
            this.uiState.motorData = res.data!;
            this.uiState.motorData.forEach((mot: any) => this.addMotor(mot));
          } else this.message.popup("Oops!", res.message!, "error");
        },
      });
    this.subscribes.push(sub);
  }

  uploadExeceFile(e: any) {
    const schema = {
      "Owner / Driver": {
        prop: "ownerDriver",
        type: String,
      },
      "Plate no": {
        prop: "plateNo",
        type: String,
      },
      "Plate char 1": {
        prop: "plateChar1",
        type: String,
      },
      "Plate char 2": {
        prop: "plateChar2",
        type: String,
      },
      "Plate char 3": {
        prop: "plateChar3",
        type: String,
      },
      "Sequence No": {
        prop: "sequenceNo",
        type: String,
        required: true,
      },
      "Custom ID": {
        prop: "customID",
        type: String,
      },
      "Brand Name": {
        prop: "brandName",
        type: String,
      },
      Model: {
        prop: "model",
        type: String,
      },
      Inception: {
        prop: "inception",
        type: Date,
        required: true,
      },
      Expiry: {
        prop: "expiry",
        type: Date,
        required: true,
      },
      "Kcl Date": {
        prop: "kclDate",
        type: Date,
        required: true,
      },
      "#seats": {
        prop: "seats",
        type: String,
      },
      "Body Type": {
        prop: "bodyType",
        type: String,
      },
      "Chassis No": {
        prop: "chassisNo",
        type: String,
        required: true,
      },
      "Market Value": {
        prop: "marketValue",
        type: String,
      },
      "Repair Type": {
        prop: "repairType",
        type: String,
      },
      "Vehicle Owner ID": {
        prop: "vehicleOwnerID",
        type: String,
      },
      "Project Name": {
        prop: "projectName",
        type: String,
      },
    };

    readXlsxFile(
      e.target.files[0],
      this.data.className === "Motor" ? { schema } : { schema }
    ).then(({ rows, errors }) => {
      if (errors.length == 0) {
        console.log(rows);
        this.uiState.data = [...rows];
        rows.forEach((mot: any) => this.addMotor(mot));
      } else {
        console.log("errrr", errors);
        this.message.popup(
          "Error",
          `Invalid File : ${errors[0].column} is ${
            errors[0].error === "required"
              ? "not match columns"
              : errors[0].error + " in"
          } ${
            errors.length < 1 && errors[0].row ? "row " + errors[0].row : ""
          }`,
          "error"
        );
      }
    });
  }

  validationChecker(): boolean {
    if (this.MotorDataArr.invalid) {
      this.message.popup(
        "Attention!",
        "Please Fill Required Inputs",
        "warning"
      );
      return false;
    }
    return true;
  }

  submit(): void {
    this.uiState.submitted = true;
    if (!this.validationChecker()) return;
    this.eventService.broadcast(reserved.isLoading, true);
    const data: MotorData[] = this.MotorDataArr.getRawValue().map((Data) => {
      return {
        ...Data,
        inception: new Date(this.appUtils.dateFormater(Data.inception)) as any,
        expiry: new Date(this.appUtils.dateFormater(Data.expiry)) as any,
        kclDate: new Date(this.appUtils.dateFormater(Data.kclDate)) as any,
        clientID: this.data.clientID,
        oasisPolRef: this.data.oasisPOlRef,
        policiesSNo: this.data.PoliciesSno,
        policyNo: this.data.PolicyNo,
      };
    });

    const MotorData: IMotorData = {
      data,
      policiesSNo: this.data.PoliciesSno,
    };

    let sub = this.productinService.SaveMotor(MotorData).subscribe(() => {
      this.message.toast("Successfully Upload Motor Data", "success");
      this.resetMotorDataArr();
      this.modal.close();
      this.eventService.broadcast(reserved.isLoading, false);
    });
    this.subscribes.push(sub);
  }

  ngOnDestroy() {
    this.subscribes.forEach((s) => s.unsubscribe());
  }
}
