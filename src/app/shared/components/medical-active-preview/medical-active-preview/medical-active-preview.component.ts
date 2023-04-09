import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { Roles } from "src/app/core/roles/Roles";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IDocumentReq } from "src/app/shared/app/models/App/IDocumentReq";
import AppUtils from "src/app/shared/app/util";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";
import { ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as XLSX from "xlsx";
import readXlsxFile from "read-excel-file";

import {
  Data,
  DataForm,
} from "src/app/shared/app/models/Production/production-util";
import {
  IMedicalActive,
  IMedicalActivePreview,
} from "src/app/shared/app/models/Production/i-medical-active-list";

@Component({
  selector: "app-medical-active-preview",
  templateUrl: "./medical-active-preview.component.html",
  styleUrls: ["./medical-active-preview.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class MedicalActivePreviewComponent implements OnInit, OnDestroy {
  @Input() data!: {
    policiesSNo: string;
    className: string;
  };
  uiState = {
    sno: "",
    policyDetails: {} as IMedicalActivePreview,
    loadedData: false,
    updatedState: false,
    data: [] as any[],
    medicalData: [] as IMedicalActive[],
    documentList: [],
    privileges: ProductionPermissions,
  };
  ExcelData: any;

  deliveryStatus: FormControl = new FormControl(null, Validators.required);

  subscribes: Subscription[] = [];

  permissions$!: Observable<string[]>;

  lookupData!: Observable<IBaseMasterTable>;

  @ViewChild("details") detailsModal!: TemplateRef<any>;
  @ViewChild("fileInput") fileInput!: ElementRef;

  modalRef!: NgbModalRef;

  DataFormArr: FormArray<FormGroup<DataForm>> = new FormArray<
    FormGroup<DataForm>
  >([]);

  addPerson(data?: Data) {
    let newData = new FormGroup<DataForm>({
      Name: new FormControl(data?.Name || null),
      Age: new FormControl(data?.Age || null),
      Type: new FormControl(data?.Type || null),
    });
    this.DataFormArr?.push(newData);
  }
  removePerson(i: number) {
    this.DataFormArr.removeAt(i);
  }
  resetFormArr() {
    this.DataFormArr.clear();
    this.uiState.data.forEach((newData: any) => this.addPerson(newData));
  }
  clearFromArr() {
    this.DataFormArr.reset();
    this.DataFormArr.clear();
    this.fileInput.nativeElement.value = "";
  }

  constructor(
    private message: MessagesService,
    private productinService: ProductionService,
    public util: AppUtils,
    public modal: NgbActiveModal,
    private privileges: PermissionsService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.permissions$ = this.privileges.getPrivileges(Roles.Production);
    this.uiState.sno = this.data.policiesSNo;
    this.getPolicyDetails(this.uiState.sno);
  }

  getPolicyDetails(policiesSNo: string): void {
    let sub = this.productinService.getClientPolicyById(policiesSNo).subscribe({
      next: (res: IBaseResponse<IMedicalActive>) => {
        if (res.status) {
          this.uiState.loadedData = true;
          this.uiState.policyDetails = res.data!;
          this.uiState.policyDetails.issueDate =
            String(this.uiState.policyDetails.issueDate) == "-"
              ? undefined
              : this.uiState.policyDetails.issueDate;
          this.uiState.policyDetails.periodFrom =
            String(this.uiState.policyDetails.periodFrom) == "-"
              ? undefined
              : this.uiState.policyDetails.periodFrom;
          this.uiState.policyDetails.periodTo =
            String(this.uiState.policyDetails.periodTo) == "-"
              ? undefined
              : this.uiState.policyDetails.periodTo;
        } else this.message.popup("Oops!", res.message!, "error");
      },
    });
    this.subscribes.push(sub);
  }

  deleteFile(index: number, path: string) {
    let data: IDocumentReq = {
      module: "Production",
      path: "",
      sno: 0,
    };
    this.message
      .confirm(` Delete it !`, ` Delete it !`, "danger", "warning")
      .then((result: any) => {
        if (result.isConfirmed) {
          let sub = this.productinService.deleteDocument(data).subscribe({
            next: (res) => {
              if (res.body?.status === true) {
                this.message.toast(res.body?.message!, "success");
              } else this.message.popup("Sorry", res.body?.message!, "warning");
            },
          });
          this.subscribes.push(sub);
        }
      });
  }

  downloadFile(path: string) {
    let data: IDocumentReq = {
      module: "Production",
      path: "",
      sno: 0,
    };
    let sub = this.productinService.downloadDocument(data).subscribe({
      next: (res) => {
        const downloadedFile = new Blob([res.body as BlobPart], {
          type: res.body,
        });
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.download = path;
        a.href = URL.createObjectURL(downloadedFile);
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);
      },
    });
    this.subscribes.push(sub);
  }

  Upload(content: any) {
    this.modalService.open(content, {
      size: "xl",
      scrollable: true,
      centered: true,
    });
  }

  // ReadExcel(event: any) {
  //   let file = event.target.files[0];
  //   const target: DataTransfer = <DataTransfer>event.target;
  //   if (target.files.length == 1 && event.target.accept === ".xlsx, .xls") {
  //     let fileReader = new FileReader();
  //     fileReader.readAsBinaryString(file);
  //     fileReader.onload = (e) => {
  //       let excelData = fileReader.result;
  //       let excelRecordsArray = (<any>excelData).trim().split(/\r\n|\n/);
  //       let header = excelRecordsArray[0].split(",");
  //       let headerdata = header.length;
  //       console.log(headerdata);
  //       for (var i = 1; i <= excelRecordsArray.length; i++) {
  //         var data = excelRecordsArray[i].split(",");
  //         var dataCount = data.length;
  //         if (headerdata !== dataCount) {
  //           this.message.popup(
  //             "Missing column or Invalid  excel file.",
  //             "error"
  //           );
  //           this.fileInput.nativeElement.value = "";
  //         } else {
  //           var workBook = XLSX.read(fileReader.result, { type: "binary" });
  //           var sheetNames = workBook.SheetNames;
  //           this.ExcelData = XLSX.utils.sheet_to_json(
  //             workBook.Sheets[sheetNames[0]]
  //           );
  //           console.log(this.ExcelData);
  //         }
  //       }
  //     };
  //   }
  // }

  // selectedRow: any;
  // edit(row: any) {
  //   this.selectedRow = row;
  //   // Code to open a modal dialog or a form to edit the selected row
  // }

  // delete(row: any) {
  //   const index = this.ExcelData.indexOf(row);
  //   if (index > -1) {
  //     this.ExcelData.splice(index, 1);
  //   }
  // }

  uploadExeceFile(e: any) {
    const schema = {
      Id_Iqama_No: {
        prop: "IdIqama No.",
        type: String,
        required: true,
      },
      Membership_No: {
        prop: "Membership No",
        type: Number,
        required: true,
      },
      Member_Name: {
        prop: "Member Name",
        type: String,
        required: true,
      },
      DOB: {
        prop: "DOB",
        type: String,
        required: true,
      },
      Relation: {
        prop: "Relation",
        type: String,
        required: true,
      },
      Marital_Status: {
        prop: "Marital Status",
        type: String,
        required: true,
      },
      Gender: {
        prop: "Gender",
        type: String,
        required: true,
      },
      Sponsor_No: {
        prop: "Sponsor No",
        type: String,
        required: true,
      },
      Endt_No: {
        prop: "Endt No",
        type: String,
        required: true,
      },
      policy_number: {
        prop: "policy number",
        type: String,
        required: true,
      },
      Class: {
        prop: "Class",
        type: String,
        required: true,
      },
      City: {
        prop: "City",
        type: String,
        required: true,
      },
      Staff_No: {
        prop: "Staff No",
        type: String,
        required: true,
      },
      Premium: {
        prop: "Premium",
        type: String,
        required: true,
      },
      Mobile_No: {
        prop: "Mobile No",
        type: String,
        required: true,
      },
      Nationality: {
        prop: "Nationality",
        type: String,
        required: true,
      },
      CCHI_Status: {
        prop: "CCHI Status",
        type: String,
        required: true,
      },
    };

    readXlsxFile(
      e.target.files[0],
      this.data.className === "Medical" ? { schema } : { schema }
    ).then(({ rows, errors }) => {
      if (errors.length == 0) {
        this.uiState.data = [...rows];
        rows.forEach((person: any) => this.addPerson(person));
      } else {
        console.log(errors);
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
  // To Do back to main route when close modal
  backToMainRoute() {
    this.modal.dismiss();
  }

  ngOnDestroy() {
    this.subscribes.forEach((s) => s.unsubscribe());
  }
}
