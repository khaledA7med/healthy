import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { IActiveList } from "src/app/shared/app/models/Production/i-active-list";
import readXlsxFile from "read-excel-file";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";
import { EventService } from "src/app/core/services/event.service";
import { reserved } from "src/app/core/models/reservedWord";
import { IMedicalActiveDataPreview } from "src/app/shared/app/models/Production/i-medical-active-preview";
import {
  MedicalData,
  MedicalDataForm,
} from "src/app/shared/app/models/Production/i-active-medical-forms";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";

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
    medicalActiveData: {} as IMedicalActiveDataPreview,
    loadedData: false,
    updatedState: false,
    data: [] as any[],
    ActiveData: [] as IActiveList[],
    documentList: [],
    privileges: ProductionPermissions,
  };
  subscribes: Subscription[] = [];

  @ViewChild("fileInput") fileInput!: ElementRef;

  DataFormArr: FormArray<FormGroup<MedicalDataForm>> = new FormArray<
    FormGroup<MedicalDataForm>
  >([]);
  addMedical(data?: MedicalData) {
    let newData = new FormGroup<MedicalDataForm>({
      idIqamaNo: new FormControl(data?.idIqamaNo || null),
      membershipNo: new FormControl(data?.membershipNo || null),
      memberName: new FormControl(data?.memberName || null),
      dob: new FormControl(data?.dob || null),
      relation: new FormControl(data?.relation || null),
      maritalStatus: new FormControl(data?.maritalStatus || null),
      gender: new FormControl(data?.gender || null),
      sponsorNo: new FormControl(data?.sponsorNo || null),
      endtNo: new FormControl(data?.endtNo || null),
      class: new FormControl(data?.class || null),
      city: new FormControl(data?.city || null),
      staffNo: new FormControl(data?.staffNo || null),
      premium: new FormControl(data?.premium || null),
      mobileNo: new FormControl(data?.mobileNo || null),
      nationality: new FormControl(data?.nationality || null),
      cchiStatus: new FormControl(data?.cchiStatus || null),
    });
    this.DataFormArr?.push(newData);
  }
  removeMedical(i: number) {
    this.DataFormArr.removeAt(i);
  }
  resetFormArr() {
    this.DataFormArr.clear();
    this.uiState.data.forEach((newData: any) => this.addMedical(newData));
  }
  clearFromArr() {
    this.DataFormArr.reset();
    this.DataFormArr.clear();
    this.fileInput.nativeElement.value = "";
  }
  constructor(
    private message: MessagesService,
    private productinService: ProductionService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.getMedicalActiveData();
  }

  getMedicalActiveData() {
    let sub = this.productinService
      .getMedicalDataById(String(this.data.PoliciesSno))
      .subscribe({
        next: (res: IBaseResponse<IMedicalActiveDataPreview>) => {
          if (res.status) {
            this.uiState.loadedData = true;
            this.uiState.medicalActiveData = res.data!;
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
        required: true,
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
        type: String,
        required: true,
      },
      Relation: {
        prop: "relation",
        type: String,
        required: true,
      },
      "Marital Status": {
        prop: "maritalStatus",
        type: String,
        required: true,
      },
      Gender: {
        prop: "gender",
        type: String,
        required: true,
      },
      "Sponsor No": {
        prop: "sponsorNo",
        type: String,
        required: true,
      },
      "Endt No": {
        prop: "endtNo",
        type: String,
        required: true,
      },
      "policy number": {
        prop: "policyNo",
        type: String,
        required: true,
      },
      Class: {
        prop: "class",
        type: String,
        required: true,
      },
      City: {
        prop: "city",
        type: String,
        required: true,
      },
      "Staff No": {
        prop: "staffNo",
        type: String,
        required: true,
      },
      Premium: {
        prop: "premium",
        type: String,
        required: true,
      },
      "Mobile No": {
        prop: "mobileNo",
        type: String,
        required: true,
      },
      Nationality: {
        prop: "nationality",
        type: String,
        required: true,
      },
      "CCHI Status": {
        prop: "cchiStatus",
        type: String,
        required: true,
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

  submit(): void {
    let formData = this.DataFormArr.getRawValue();
    let newData: MedicalData[] = formData.map((data) => {
      return {
        ...data,
        clientID: this.data.clientID,
        oasisPolRef: this.data.oasisPOlRef,
        policiesSNo: this.data.PoliciesSno,
        policyNo: data.policyNo || this.data.PolicyNo,
      };
    });

    let sub = this.productinService.SaveMedical(newData).subscribe((res) => {
      this.message.toast("Successfully Uploaded Medical Data", "success");
      this.resetFormArr();
      this.modal.close();
    });
    this.subscribes.push(sub);
  }

  ngOnDestroy() {
    this.subscribes.forEach((s) => s.unsubscribe());
  }
}
