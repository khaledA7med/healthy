import { HttpResponse } from "@angular/common/http";
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { ProductionPermissions } from "src/app/core/roles/production-permissions";
import { Roles } from "src/app/core/roles/Roles";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { IMedicalAcivePreview } from "src/app/shared/app/models/Production/i-medical-active-list-preview";
import AppUtils from "src/app/shared/app/util";
import { MessagesService } from "src/app/shared/services/messages.service";
import { ProductionService } from "src/app/shared/services/production/production.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-medical-active-preview",
  templateUrl: "./medical-active-preview.component.html",
  styleUrls: ["./medical-active-preview.component.scss"],
})
export class MedicalActivePreviewComponent implements OnInit, OnDestroy {
  @Input() data!: {
    id: string;
  };
  uiState = {
    sno: "",
    medicalActiveDetails: {} as IMedicalAcivePreview,
    loadedData: false,
    updatedState: false,
  };

  subscribes: Subscription[] = [];
  lookupData!: Observable<IBaseMasterTable>;

  @ViewChild("details") detailsModal!: TemplateRef<any>;
  constructor(
    private message: MessagesService,
    private productinService: ProductionService,
    public util: AppUtils,
    public modal: NgbActiveModal,
    private privileges: PermissionsService
  ) {}
  ngOnInit(): void {
    this.uiState.sno = this.data.id;
    this.getMedicalActiveDetails(this.uiState.sno);
  }

  getMedicalActiveDetails(id: string): void {
    // let sub = this.productinService.getPolicyById(id).subscribe({
    //   next: (res: IBaseResponse<IMedicalAcivePreview>) => {
    //     if (res.status) {
    //       this.uiState.loadedData = true;
    //       this.uiState.medicalActiveDetails = res.data!;
    //     } else this.message.popup("Oops!", res.message!, "error");
    //   },
    // });
    // this.subscribes.push(sub);
  }

  // To Do back to main route when close modal
  backToMainRoute() {
    this.modal.dismiss();
  }

  ngOnDestroy() {
    this.subscribes.forEach((s) => s.unsubscribe());
  }
}
