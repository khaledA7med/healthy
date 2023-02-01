import {
  AfterViewInit,
  Component,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import Swal from "sweetalert2";

import AppUtils from "../../app/util";
import { ClientStatus, ClientType } from "../../app/models/Clients/clientUtil";
import { IClientPreview } from "../../app/models/Clients/iclient-preview";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { ClientsService } from "src/app/shared/services/clients/clients.service";
import { ClientsGroupsService } from "../../services/clients/clients.groups.service";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IChangeStatusRequest } from "../../app/models/Clients/iclientStatusReq";

@Component({
  selector: "app-modal-for-details",
  templateUrl: "./client-preview.component.html",
  styleUrls: ["./client-preview.component.scss"],
})
export class ClientPreviewComponent implements AfterViewInit, OnDestroy {
  uiState = {
    sno: 0,
    clientDetails: {} as IClientPreview,
    updatedState: false,
  };
  clientStatus: typeof ClientStatus = ClientStatus;
  clientType: typeof ClientType = ClientType;
  subscribes: Subscription[] = [];
  previewModalRef!: NgbModalRef;
  addToGroupModalRef!: NgbModalRef;
  addClientToGroupForm!: FormGroup;
  lookupData!: Observable<IBaseMasterTable>;
  @ViewChild("details") detailsModal!: TemplateRef<any>;
  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private clientService: ClientsService,
    private router: Router,
    private message: MessagesService,
    private clientsGroupService: ClientsGroupsService,
    private table: MasterTableService
  ) {}

  ngAfterViewInit(): void {
    this.openPreviewModal();
    this.getSNO();
    this.getClintDetails(this.uiState.sno);
    this.initAddClientToGroupForm();
    this.getLookupData();
  }

  openPreviewModal(): void {
    this.previewModalRef = this.modalService.open(this.detailsModal, {
      fullscreen: true,
    });
    this.backToMainRoute();
  }

  getSNO(): void {
    this.route.paramMap.subscribe((res) => {
      this.uiState.sno = +res.get("id")!;
    });
  }

  getClintDetails(sno: number): void {
    let sub = this.clientService.getClintDetails(sno).subscribe({
      next: (res: HttpResponse<IBaseResponse<IClientPreview>>) => {
        this.uiState.clientDetails = res.body?.data!;
        AppUtils.nullValues(this.uiState.clientDetails);
        this.uiState.clientDetails.documentLists?.forEach((el) => {
          el.contentDisposition = el.contentDisposition?.split("/")[0];
        });
      },
      error: (error: HttpErrorResponse) => {
        this.message.popup("Oops!", error.message, "error");
      },
    });
    this.subscribes.push(sub);
  }

  changeStatus(newStatus: string): void {
    let reqBody = {
      clientId: this.uiState.sno,
      status: newStatus,
    };

    if (newStatus === ClientStatus.Rejected) {
      this.changeStatusWithMsg(reqBody);
    } else {
      this.message
        .confirm(`${newStatus} it !`, `${newStatus} it`, "success", "warning")
        .then((result: any) => {
          if (result.isConfirmed) {
            let sub = this.clientService.changeStatus(reqBody).subscribe({
              next: (res: HttpResponse<IBaseResponse<null>>) => {
                this.message.toast(res.body?.message!, "success");
                this.uiState.updatedState = true;
                this.previewModalRef.close();
                this.backToMainRoute();
              },
              error: (error: HttpErrorResponse) => {
                this.message.popup("Oops!", error.message, "error");
              },
            });
            this.subscribes.push(sub);
          }
        });
    }
  }
  changeStatusWithMsg(reqBody: IChangeStatusRequest) {
    return Swal.fire({
      title: "Type Rejection Reason",
      input: "text",
      inputAttributes: {
        required: "true",
      },
      validationMessage: "Required",
      showCancelButton: true,
      background: "var(--vz-modal-bg)",
      customClass: {
        confirmButton: "btn btn-success btn-sm w-xs me-2 mt-2",
        cancelButton: "btn btn-ghost-danger btn-sm w-xs mt-2",
        input: "customize-swlInput",
        validationMessage: "fs-6 bg-transparent  m-1 p-1",
      },
      confirmButtonText: `Reject`,
      buttonsStyling: false,
      showCloseButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      preConfirm: (inputValue: string) => {
        reqBody = {
          ...reqBody,
          rejectionReason: inputValue,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        let sub = this.clientService.changeStatus(reqBody).subscribe({
          next: (res: HttpResponse<IBaseResponse<null>>) => {
            this.message.toast(res.body?.message!, "success");
            this.uiState.updatedState = true;
            this.previewModalRef.close();
            this.backToMainRoute();
          },
          error: (error: HttpErrorResponse) => {
            this.message.popup("Oops!", error.message, "error");
          },
        });
        this.subscribes.push(sub);
      }
    });
  }
  //#region  Add Client To Group
  openAddClientToGroupModal(modal: TemplateRef<any>): void {
    this.addToGroupModalRef = this.modalService.open(modal, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
    });
    this.addToGroupModalRef.hidden.subscribe(() => {
      this.addClientToGroupForm.reset();
    });
  }

  initAddClientToGroupForm(): void {
    this.addClientToGroupForm = new FormGroup({
      clientId: new FormControl(this.uiState.sno, Validators.required),
      groupName: new FormControl(null, Validators.required),
    });
  }
  getLookupData() {
    this.lookupData = this.table.getBaseData(MODULES.Client);
  }
  get form() {
    return this.addClientToGroupForm.controls;
  }
  submitAddClientToGroupForm(): void {
    if (!this.addClientToGroupForm.valid) {
      return;
    } else {
      this.addClientToGroupReq();
    }
  }
  addClientToGroupReq(): void {
    let sub = this.clientsGroupService
      .addGroupClient(this.form["clientId"].value, this.form["groupName"].value)
      .subscribe({
        // no data here
        next: (res: HttpResponse<IBaseResponse<null>>) => {
          if (res.body?.status) {
            this.message.toast(res.body?.message!, "success");
            this.uiState.updatedState = true;
            this.addToGroupModalRef.close();
            this.previewModalRef.close();
            this.backToMainRoute();
          } else this.message.popup("Sorry", res.body?.message!, "warning");
        },
        error: (error) => this.message.popup("Oops!", error.message, "error"),
      });
    this.subscribes.push(sub);
  }
  //#endregion

  // To Do back to main route when close modal
  backToMainRoute() {
    this.previewModalRef.hidden.subscribe(() => {
      this.router.navigate([{ outlets: { details: null } }], {
        state: { updated: this.uiState.updatedState },
      });
    });
  }

  ngOnDestroy() {
    this.subscribes.forEach((s) => s.unsubscribe());
  }
}
