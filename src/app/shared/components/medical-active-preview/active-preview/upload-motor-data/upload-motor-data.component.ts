import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { EventService } from "src/app/core/services/event.service";
import { IActiveList } from "src/app/shared/app/models/Production/i-active-list";
import {
  MotorData,
  MotorDataForm,
} from "src/app/shared/app/models/Production/i-active-motor-forms";
import { IMotorActiveDataPreview } from "src/app/shared/app/models/Production/i-motor-active-preview";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";
import readXlsxFile from "read-excel-file";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import AppUtils from "src/app/shared/app/util";

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
    motorActiveData: {} as IMotorActiveDataPreview,
    loadedData: false,
    updatedState: false,
    data: [] as any[],
    ActiveData: [] as IActiveList[],
    documentList: [],
    privileges: ProductionPermissions,
  };
  subscribes: Subscription[] = [];

  @ViewChild("fileInput") fileInput!: ElementRef;

  DataFormArr: FormArray<FormGroup<MotorDataForm>> = new FormArray<
    FormGroup<MotorDataForm>
  >([]);
  addMotor(data?: MotorData) {
    let newData = new FormGroup<MotorDataForm>({
      ownerDriver: new FormControl(data?.ownerDriver || null),
      plateNo: new FormControl(data?.plateNo || null),
      plateChar1: new FormControl(data?.plateChar1 || null),
      plateChar2: new FormControl(data?.plateChar2 || null),
      plateChar3: new FormControl(data?.plateChar3 || null),
      sequenceNo: new FormControl(data?.sequenceNo || null),
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
      // inception: new FormControl(data?.inception || null),
      // expiry: new FormControl(data?.expiry || null),
      // kclDate: new FormControl(data?.kclDate || null),
      seats: new FormControl(data?.seats || null),
      bodyType: new FormControl(data?.bodyType || null),
      chassisNo: new FormControl(data?.chassisNo || null),
      marketValue: new FormControl(data?.marketValue || null),
      repairType: new FormControl(data?.repairType || null),
      vehicleOwnerID: new FormControl(data?.vehicleOwnerID || null),
      projectName: new FormControl(data?.projectName || null),
    });
    this.DataFormArr?.push(newData);
  }

  DataFormArrControls(i: number, control: string): AbstractControl {
    return this.DataFormArr.controls[i].get(control)!;
  }

  Dates(e: any, i: any, control: string) {
    this.DataFormArrControls(i, control).patchValue(e.gon);
  }

  removeMedical(i: number) {
    this.DataFormArr.removeAt(i);
  }
  resetFormArr() {
    this.DataFormArr.clear();
    this.uiState.data.forEach((newData: any) => this.addMotor(newData));
  }
  clearFromArr() {
    this.DataFormArr.reset();
    this.DataFormArr.clear();
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
        next: (res: IBaseResponse<IMotorActiveDataPreview>) => {
          if (res.status) {
            this.uiState.loadedData = true;
            this.uiState.motorActiveData = res.data!;
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
        required: true,
      },
      "Plate no": {
        prop: "plateNo",
        type: String,
        required: true,
      },
      "Plate char 1": {
        prop: "plateChar1",
        type: String,
        required: true,
      },
      "Plate char 2": {
        prop: "plateChar2",
        type: String,
        required: true,
      },
      "Plate char 3": {
        prop: "plateChar3",
        type: String,
        required: true,
      },
      "Sequence No": {
        prop: "sequenceNo",
        type: String,
        required: true,
      },
      "Custom ID": {
        prop: "customID",
        type: String,
        required: true,
      },
      "Brand Name": {
        prop: "brandName",
        type: String,
        required: true,
      },
      Model: {
        prop: "model",
        type: String,
        required: true,
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
        required: true,
      },
      "Body Type": {
        prop: "bodyType",
        type: String,
        required: true,
      },
      "Chassis No": {
        prop: "chassisNo",
        type: String,
        required: true,
      },
      "Market Value": {
        prop: "marketValue",
        type: String,
        required: true,
      },
      "Repair Type": {
        prop: "repairType",
        type: String,
        required: true,
      },
      "Vehicle Owner ID": {
        prop: "vehicleOwnerID",
        type: String,
        required: true,
      },
      "Project Name": {
        prop: "projectName",
        type: String,
        required: true,
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

  submit(): void {
    let formData = this.DataFormArr.getRawValue();
    let newData: MotorData[] = formData.map((data) => {
      return {
        ...data,
        inception: new Date(this.appUtils.dateFormater(data.inception)) as any,
        expiry: new Date(this.appUtils.dateFormater(data.expiry)) as any,
        kclDate: new Date(this.appUtils.dateFormater(data.kclDate)) as any,
        clientID: this.data.clientID,
        oasisPolRef: this.data.oasisPOlRef,
        policiesSNo: this.data.PoliciesSno,
        policyNo: this.data.PolicyNo,
      };
    });

    let sub = this.productinService.SaveMotor(newData).subscribe((res) => {
      this.message.toast("Successfully Upload Motor Data", "success");
      this.resetFormArr();
      this.modal.close();
    });
    this.subscribes.push(sub);
  }

  ngOnDestroy() {
    this.subscribes.forEach((s) => s.unsubscribe());
  }
}
