import { ClientStatus } from "../../app/models/Clients/clientUtil";
import { IClientPreview } from "../../app/models/Clients/iclient-preview";
import { MessagesService } from "src/app/shared/services/messages.service";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { ClientsService } from "src/app/shared/services/clients/clients.service";
import {
  AfterViewInit,
  Component,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import AppUtils from "../../app/util";

@Component({
  selector: "app-modal-for-details",
  templateUrl: "./client-preview.component.html",
  styleUrls: ["./client-preview.component.scss"],
})
export class ClientPreviewComponent implements AfterViewInit, OnDestroy {
  uiState = {
    sno: 0,
    clientDetails: {} as IClientPreview,
  };
  clientStatus: typeof ClientStatus = ClientStatus;
  subscribes: Subscription[] = [];
  modalRef!: NgbModalRef;
  @ViewChild("details") details!: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private clintService: ClientsService,
    private router: Router,
    private message: MessagesService
  ) {}

  ngAfterViewInit(): void {
    this.modalRef = this.modalService.open(this.details, { fullscreen: true });

    this.route.paramMap.subscribe((res) => {
      this.uiState.sno = +res.get("id")!;
    });

    this.getClintDetails(this.uiState.sno);
    this.backToMainRoute();
  }

  getClintDetails(sno: number) {
    let sub = this.clintService.getClintDetails(sno).subscribe({
      next: (res: HttpResponse<IBaseResponse<IClientPreview>>) => {
        this.uiState.clientDetails = res.body?.data!;
        AppUtils.nullValues(this.uiState.clientDetails);
        console.log(this.uiState.clientDetails);
      },
      error: (error: HttpErrorResponse) => {
        this.message.popup("Oops!", error.message, "error");
      },
    });
    this.subscribes.push(sub);
  }

  // To Do back to main route when close modal
  backToMainRoute() {
    this.modalRef.hidden.subscribe(() => {
      this.router.navigate([{ outlets: { details: null } }]);
    });
  }
  changeStatus(newStatus: String) {
    let reqBody = {
      clientId: this.uiState.sno,
      status: newStatus,
    };
    // return service not Completed because response interface
  }

  ngOnDestroy() {
    this.subscribes.forEach((s) => s.unsubscribe());
  }
}
