import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
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
import { IActiveList } from "src/app/shared/app/models/Production/i-active-list";
import readXlsxFile from "read-excel-file";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";
import { IMedicalActiveDataPreview } from "src/app/shared/app/models/Production/i-medical-active-preview";
import {
  IMedicalData,
  MedicalData,
  MedicalDataForm,
} from "src/app/shared/app/models/Production/i-active-medical-forms";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import AppUtils from "src/app/shared/app/util";
import { EventService } from "src/app/core/services/event.service";
import { reserved } from "src/app/core/models/reservedWord";

@Component({
  selector: "app-upload-medical-data",
  templateUrl: "./upload-medical-data.component.html",
  styleUrls: ["./upload-medical-data.component.scss"],
})
export class UploadMedicalDataComponent implements OnInit, OnDestroy {
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
    medicalActiveData: {} as IMedicalActiveDataPreview,
    medicalData: [] as MedicalData[],
    loadedData: false,
    updatedState: false,
    data: [] as any[],
    ActiveData: [] as IActiveList[],
    documentList: [],
    privileges: ProductionPermissions,
  };
  subscribes: Subscription[] = [];

  @ViewChild("fileInput") fileInput!: ElementRef;

  MedicalDataArr: FormArray<FormGroup<MedicalDataForm>> = new FormArray<
    FormGroup<MedicalDataForm>
  >([]);
  addMedical(data?: MedicalData) {
    let newData = new FormGroup<MedicalDataForm>({
      idIqamaNo: new FormControl(data?.idIqamaNo || null),
      membershipNo: new FormControl(
        data?.membershipNo || null,
        Validators.required
      ),
      memberName: new FormControl(
        data?.memberName || null,
        Validators.required
      ),
      dob: new FormControl(
        (this.appUtils.dateStructFormat(data?.dob!) as any) || null
      ),
      relation: new FormControl(data?.relation || null),
      maritalStatus: new FormControl(data?.maritalStatus || null),
      gender: new FormControl(data?.gender || null),
      sponsorNo: new FormControl(data?.sponsorNo || null),
      endtNo: new FormControl(data?.endtNo || null),
      policyNo: new FormControl(data?.policyNo || null),
      class: new FormControl(data?.class || null),
      city: new FormControl(data?.city || null),
      staffNo: new FormControl(data?.staffNo || null),
      premium: new FormControl(data?.premium || null),
      mobileNo: new FormControl(data?.mobileNo || null),
      nationality: new FormControl(data?.nationality || null),
      cchiStatus: new FormControl(data?.cchiStatus || null),
    });
    this.MedicalDataArr?.push(newData);
  }

  MedicalDataArrControls(i: number, control: string): AbstractControl {
    return this.MedicalDataArr.controls[i].get(control)!;
  }

  Dates(e: any, i: any, control: string) {
    this.MedicalDataArrControls(i, control).patchValue(e.gon);
  }

  removeMedical(i: number) {
    this.MedicalDataArr.removeAt(i);
  }
  resetMedicalDataArr() {
    this.MedicalDataArr.clear();
    this.uiState.data.forEach((newData: any) => this.addMedical(newData));
  }
  clearMedicalDataArr() {
    this.MedicalDataArr.reset();
    this.MedicalDataArr.clear();
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
    this.getMedicalActiveData();
  }

  getMedicalActiveData() {
    let sub = this.productinService
      .getMedicalDataById(String(this.data.PoliciesSno))
      .subscribe({
        next: (res: IBaseResponse<MedicalData[]>) => {
          if (res.status) {
            this.uiState.loadedData = true;
            this.uiState.medicalData = res.data!;
            this.uiState.medicalData.forEach((med: any) =>
              this.addMedical(med)
            );
          } else this.message.popup("Oops!", res.message!, "error");
        },
      });
    this.subscribes.push(sub);
  }

  uploadExeceFile(e: any) {
    const schema = {
      "idIqama No.": {
        prop: "idIqamaNo",
        type: String,
      },
      "Membership No": {
        prop: "membershipNo",
        type: String,
        required: true,
      },
      "Member Name": {
        prop: "memberName",
        type: String,
        required: true,
      },
      DOB: {
        prop: "dob",
        type: Date,
        required: true,
      },
      Relation: {
        prop: "relation",
        type: String,
      },
      "Marital Status": {
        prop: "maritalStatus",
        type: String,
      },
      Gender: {
        prop: "gender",
        type: String,
      },
      "Sponsor No": {
        prop: "sponsorNo",
        type: String,
      },
      "Endt No": {
        prop: "endtNo",
        type: String,
      },
      "policy number": {
        prop: "policyNo",
        type: String,
      },
      Class: {
        prop: "class",
        type: String,
      },
      City: {
        prop: "city",
        type: String,
      },
      "Staff No": {
        prop: "staffNo",
        type: String,
      },
      Premium: {
        prop: "premium",
        type: String,
      },
      "Mobile No": {
        prop: "mobileNo",
        type: String,
      },
      Nationality: {
        prop: "nationality",
        type: String,
      },
      "CCHI Status": {
        prop: "cchiStatus",
        type: String,
      },
    };

    readXlsxFile(
      e.target.files[0],
      this.data.className === "Medical" ? { schema } : { schema }
    ).then(({ rows, errors }) => {
      if (errors.length == 0) {
        console.log(rows);
        this.uiState.data = [...rows];
        rows.forEach((med: any) => this.addMedical(med));
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
    if (this.MedicalDataArr.invalid) {
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
    const data: MedicalData[] = this.MedicalDataArr.getRawValue().map(
      (Data) => {
        return {
          ...Data,
          dob: new Date(this.appUtils.dateFormater(Data.dob)) as any,
          clientID: this.data.clientID,
          oasisPolRef: this.data.oasisPOlRef,
          policiesSNo: this.data.PoliciesSno,
          policyNo: this.data.PolicyNo,
        };
      }
    );

    const MedicalData: IMedicalData = {
      data,
      policiesSNo: this.data.PoliciesSno,
    };

    let sub = this.productinService.SaveMedical(MedicalData).subscribe(() => {
      this.message.toast("Successfully Upload Medical Data", "success");
      this.resetMedicalDataArr();
      this.modal.close();
      this.eventService.broadcast(reserved.isLoading, false);
    });
    this.subscribes.push(sub);
  }

  ngOnDestroy() {
    this.subscribes.forEach((s) => s.unsubscribe());
  }
}
