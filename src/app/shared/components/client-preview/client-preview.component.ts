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
import { Subscription } from "rxjs";

import AppUtils from "../../app/util";
import { ClientStatus, ClientType } from "../../app/models/Clients/clientUtil";
import { IClientPreview } from "../../app/models/Clients/iclient-preview";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { ClientsService } from "src/app/shared/services/clients/clients.service";
import { IClientGroups } from "../../app/models/Clients/iclientgroups";
import { ClientsGroupsService } from "../../services/clients/clients.groups.service";

@Component({
  selector: "app-modal-for-details",
  templateUrl: "./client-preview.component.html",
  styleUrls: ["./client-preview.component.scss"],
})
export class ClientPreviewComponent implements AfterViewInit, OnDestroy {
  uiState = {
    sno: 0,
    clientDetails: {} as IClientPreview,
    groupsNames: [] as IClientGroups[],
  };
  clientStatus: typeof ClientStatus = ClientStatus;
  clientType: typeof ClientType = ClientType;
  subscribes: Subscription[] = [];
  previewModalRef!: NgbModalRef;
  addToGroupModalRef!: NgbModalRef;
  addClientToGroupForm!: FormGroup;
  @ViewChild("details") detailsModal!: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private clintService: ClientsService,
    private router: Router,
    private message: MessagesService,
    private clientsGroupService: ClientsGroupsService
  ) {}

  ngAfterViewInit(): void {
    this.openPreviewModal();
    this.getSNO();
    this.getClintDetails(this.uiState.sno);
    this.getAllClientsGroups();
    this.initAddClientToGroupForm();
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
    let sub = this.clintService.getClintDetails(sno).subscribe({
      next: (res: HttpResponse<IBaseResponse<IClientPreview>>) => {
        this.uiState.clientDetails = res.body?.data!;
        AppUtils.nullValues(this.uiState.clientDetails);
      },
      error: (error: HttpErrorResponse) => {
        this.message.popup("Oops!", error.message, "error");
      },
    });
    this.subscribes.push(sub);
  }

  changeStatus(newStatus: String): void {
    let reqBody = {
      clientId: this.uiState.sno,
      status: newStatus,
    };
    // return service not Completed because response interface
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

  getAllClientsGroups(): void {
    let sub = this.clientsGroupService.getAllClientsGroups().subscribe({
      next: (res: HttpResponse<IBaseResponse<IClientGroups[]>>) => {
        this.uiState.groupsNames = res.body?.data!;
      },
      error: (error: HttpErrorResponse) => {
        this.message.popup("Oops!", error.message, "error");
      },
    });
    this.subscribes.push(sub);
  }

  initAddClientToGroupForm(): void {
    this.addClientToGroupForm = new FormGroup({
      clientId: new FormControl(this.uiState.sno, Validators.required),
      groupName: new FormControl(null, Validators.required),
    });
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
          } else {
            this.message.popup("", res.body?.message!, "error");
          }
          this.addToGroupModalRef.close();
          this.previewModalRef.close();
          this.backToMainRoute();
        },
        error: (error) => {
          this.message.popup("Oops!", error.message, "error");
        },
      });
    this.subscribes.push(sub);
  }
  //#endregion

  // To Do back to main route when close modal
  backToMainRoute() {
    this.previewModalRef.hidden.subscribe(() => {
      this.router.navigate([{ outlets: { details: null } }]);
    });
  }

  ngOnDestroy() {
    this.subscribes.forEach((s) => s.unsubscribe());
  }
}
