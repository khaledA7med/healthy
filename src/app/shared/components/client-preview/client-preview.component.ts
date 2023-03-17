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
import { IDocumentList } from "./../../app/models/App/IDocument";
import { EventService } from "src/app/core/services/event.service";
import { reserved } from "src/app/core/models/reservedWord";
import { MasterMethodsService } from "../../services/master-methods.service";
import { PermissionsService } from "src/app/core/services/permissions.service";
import { Roles } from "src/app/core/roles/Roles";
import { ClientsPermissions } from "src/app/core/roles/clients-permissions";

@Component({
  selector: "app-modal-for-details",
  templateUrl: "./client-preview.component.html",
  styleUrls: ["./client-preview.component.scss"],
})
export class ClientPreviewComponent implements AfterViewInit, OnDestroy {
  uiState = {
    id: "",
    clientDetails: {} as IClientPreview,
    updatedState: false,
  };

  permissions$!: Observable<string[]>;
  privileges = ClientsPermissions;
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
    private table: MasterTableService,
    private eventService: EventService,
    private masterMethod: MasterMethodsService,
    public util: AppUtils,
    private permission: PermissionsService
  ) {}

  ngAfterViewInit(): void {
    this.openPreviewModal();
    this.getId();
    this.getClintDetails(this.uiState.id);
    this.initAddClientToGroupForm();
    this.getLookupData();
    this.permissions$ = this.permission.getPrivileges(Roles.Clients);
  }

  openPreviewModal(): void {
    this.previewModalRef = this.modalService.open(this.detailsModal, {
      fullscreen: true,
    });
    this.backToMainRoute();
  }

  getId(): void {
    this.route.paramMap.subscribe((res) => {
      this.uiState.id = res.get("id")!;
    });
  }

  getClintDetails(id: string): void {
    this.eventService.broadcast(reserved.isLoading, true);

    let sub = this.clientService.getClintDetails(id).subscribe({
      next: (res: HttpResponse<IBaseResponse<IClientPreview>>) => {
        this.uiState.clientDetails = res.body?.data!;
        AppUtils.nullValues(this.uiState.clientDetails);
        this.uiState.clientDetails.clientsBankAccounts?.map((b) =>
          AppUtils.nullValues(b)
        );
        this.uiState.clientDetails.clientContacts?.map((c) =>
          AppUtils.nullValues(c)
        );
        this.customizeClientDocuments();
        this.eventService.broadcast(reserved.isLoading, false);
      },
      error: (error: HttpErrorResponse) => {
        this.eventService.broadcast(reserved.isLoading, false);

        this.message.popup("Oops!", error.message, "error");
      },
    });
    this.subscribes.push(sub);
  }
  customizeClientDocuments() {
    this.uiState.clientDetails.documentList?.forEach((el: IDocumentList) => {
      switch (el.type) {
        case "zip":
          (el.className = "zip-fill"), (el.colorName = "text-success");
          break;
        case "pdf":
          (el.className = "pdf-line"), (el.colorName = "text-danger");
          break;
        case "csv":
          (el.className = "code-fill"), (el.colorName = "text-primary");
          break;
        case "txt":
          (el.className = "text-fill"), (el.colorName = "text-dark");
          break;
        case "docx":
        case "doc":
          (el.className = "word-2-fill"), (el.colorName = "text-primary");
          break;
        case "xls":
        case "xlsx":
          (el.className = "excel-2-fill"), (el.colorName = "text-success");
          break;
        case "ppt":
        case "pptx":
          (el.className = "ppt-2-fill"), (el.colorName = "text-danger");
          break;
        case "image":
          break;
        default:
          (el.className = "warning-fill"), (el.colorName = "text-warning");
      }

      el.size = this.util.formatBytes(+el?.size!);
    });
  }
  deleteFile(index: number, path: string) {
    this.message
      .confirm(` Delete it !`, ` Delete it !`, "danger", "warning")
      .then((result: any) => {
        if (result.isConfirmed) {
          let sub = this.masterMethod.deleteFile(path).subscribe({
            next: (res) => {
              if (res.body?.status === true) {
                this.message.toast(res.body?.message!, "success");
                this.uiState.clientDetails.documentList?.splice(index, 1);
              } else this.message.popup("Sorry", res.body?.message!, "warning");
            },
            error: (error) => {
              this.message.popup("Oops!", error.message, "error");
            },
          });
          this.subscribes.push(sub);
        }
      });
  }
  downloadFile(path: string) {
    let sub = this.masterMethod.downloadFile(path).subscribe({
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
      error: (error) => {
        this.message.popup("Oops!", error.message, "error");
      },
    });
    this.subscribes.push(sub);
  }

  changeStatus(newStatus: string): void {
    let reqBody = {
      clientId: this.uiState.clientDetails.sNo!,
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
      clientId: new FormControl(
        this.uiState.clientDetails.sNo,
        Validators.required
      ),
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
      .addClient(this.form["clientId"].value, this.form["groupName"].value)
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
