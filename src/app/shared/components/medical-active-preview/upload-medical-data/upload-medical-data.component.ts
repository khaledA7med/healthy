import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { IActiveList } from "src/app/shared/app/models/Production/i-active-list";
import {
  MedicalData,
  MedicalDataForm,
} from "src/app/shared/app/models/Production/production-util";
import readXlsxFile from "read-excel-file";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";
import { EventService } from "src/app/core/services/event.service";
import { reserved } from "src/app/core/models/reservedWord";
import { IMedicalActiveDataPreview } from "src/app/shared/app/models/Production/i-medical-active-preview";

@Component({
  selector: "app-upload-medical-data",
  templateUrl: "./upload-medical-data.component.html",
  styleUrls: ["./upload-medical-data.component.scss"],
})
export class UploadMedicalDataComponent implements OnInit, OnDestroy {
  @Input() data!: {
    policiesSNo: number;
    className: string;
  };
  uiState = {
    policiesSNo: 0,
    medicalActiveData: {} as IMedicalActiveDataPreview,
    loadedData: false,
    updatedState: false,
    data: [] as any[],
    medicalData: [] as IActiveList[],
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
      sNo: new FormControl(data?.sNo || null),
      oasisPolRef: new FormControl(data?.oasisPolRef || null),
      policiesSNo: new FormControl(data?.policiesSNo || null),
      policyNo: new FormControl(data?.policyNo || null),
      clientID: new FormControl(data?.clientID || null),
      valid: new FormControl(data?.valid || null),
      idIqamaNo: new FormControl(data?.idIqamaNo || null),
      membershipNo: new FormControl(data?.membershipNo || null),
      memberName: new FormControl(data?.memberName || null),
      dob: new FormControl(data?.dob || null),
      relation: new FormControl(data?.relation || null),
      maritalStatus: new FormControl(data?.maritalStatus || null),
      gender: new FormControl(data?.gender || null),
      sponsorNo: new FormControl(data?.sponsorNo || null),
      endtNo: new FormControl(data?.endtNo || null),
      policyNumber: new FormControl(data?.policyNumber || null),
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
    public modal: NgbActiveModal,
    private eventService: EventService
  ) {}

  ngOnInit(): void {}

  uploadExeceFile(e: any) {
    const schema = {
      idIqamaNo: {
        prop: "idIqamaNo",
        type: String,
      },
      membershipNo: {
        prop: "membershipNo",
        type: String,
        required: true,
      },
      memberName: {
        prop: "memberName",
        type: String,
        required: true,
      },
      dob: {
        prop: "dob",
        type: String,
        required: true,
      },
      relation: {
        prop: "relation",
        type: String,
      },
      maritalStatus: {
        prop: "maritalStatus",
        type: String,
      },
      gender: {
        prop: "gender",
        type: String,
      },
      sponsorNo: {
        prop: "sponsorNo",
        type: String,
      },
      endtNo: {
        prop: "endtNo",
        type: String,
      },
      policyNumber: {
        prop: "policyNumber",
        type: String,
      },
      class: {
        prop: "class",
        type: String,
      },
      city: {
        prop: "city",
        type: String,
      },
      staffNo: {
        prop: "staffNo",
        type: String,
      },
      premium: {
        prop: "premium",
        type: Number,
      },
      mobileNo: {
        prop: "mobileNo",
        type: String,
      },
      nationality: {
        prop: "nationality",
        type: String,
      },
      cchiStatus: {
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
        rows.forEach((person: any) => this.addMedical(person));
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

  submit(DataFormArr: FormArray): void {
    console.log(DataFormArr.value);
  }

  ngOnDestroy() {
    this.subscribes.forEach((s) => s.unsubscribe());
  }
}
