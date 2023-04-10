import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { Roles } from "src/app/core/roles/Roles";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import AppUtils from "src/app/shared/app/util";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";
import { ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { IActiveList } from "src/app/shared/app/models/Production/i-active-list";
import { UploadMedicalDataComponent } from "../upload-medical-data/upload-medical-data.component";
import { IActiveListPreview } from "src/app/shared/app/models/Production/i-active-list-preview";
import { IMedicalActiveDataPreview } from "src/app/shared/app/models/Production/i-medical-active-preview";

@Component({
  selector: "app-active-preview",
  templateUrl: "./active-preview.component.html",
  styleUrls: ["./active-preview.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ActivePreviewComponent implements OnInit, OnDestroy {
  @Input() data!: {
    policiesSNo: string;
    className: string;
  };
  uiState = {
    sno: "",
    policiesSNo: 0,
    policyDetails: {} as IActiveListPreview,
    medicalActiveData: {} as IMedicalActiveDataPreview,
    loadedData: false,
    updatedState: false,
    data: [] as any[],
    medicalData: [] as IActiveList[],
    privileges: ProductionPermissions,
  };

  deliveryStatus: FormControl = new FormControl(null, Validators.required);

  subscribes: Subscription[] = [];

  permissions$!: Observable<string[]>;

  lookupData!: Observable<IBaseMasterTable>;

  @ViewChild("details") detailsModal!: TemplateRef<any>;

  modalRef!: NgbModalRef;

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
      next: (res: IBaseResponse<IActiveList>) => {
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

  getMedicalActiveData(policiesSNo: number) {
    let sub = this.productinService.getMedicalDataById(policiesSNo).subscribe({
      next: (res: IBaseResponse<IMedicalActiveDataPreview>) => {
        if (res.status) {
          this.uiState.loadedData = true;
          this.uiState.medicalActiveData = res.data!;
        } else this.message.popup("Oops!", res.message!, "error");
      },
    });
    this.subscribes.push(sub);
  }

  Upload(policiesSNo: number) {
    this.modalRef = this.modalService.open(UploadMedicalDataComponent, {
      size: "xl",
      scrollable: true,
      centered: true,
    });

    console.log(policiesSNo);
    this.getMedicalActiveData(policiesSNo);
    this.modalRef.componentInstance.data = {
      policiesSNo,
      className: this.uiState.policyDetails.className,
    };
  }

  // To Do back to main route when close modal
  backToMainRoute() {
    this.modal.dismiss();
  }

  ngOnDestroy() {
    this.subscribes.forEach((s) => s.unsubscribe());
  }
}
