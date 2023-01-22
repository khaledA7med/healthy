import { MessagesService } from "src/app/shared/services/messages.service";
import { IClient } from "src/app/shared/app/models/Clients/iclient";
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

@Component({
  selector: "app-modal-for-details",
  templateUrl: "./modal-for-details.component.html",
  styleUrls: ["./modal-for-details.component.scss"],
})
export class ModalForDetailsComponent implements AfterViewInit, OnDestroy {
  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private clintService: ClientsService,
    private router: Router,
    private message: MessagesService
  ) {}
  modalRef!: NgbModalRef;
  @ViewChild("details") details!: TemplateRef<any>;

  uiState = {
    sno: 0,
    clintDetails: {} as IClient,
  };
  subscribes: Subscription[] = [];

  ngAfterViewInit(): void {
    this.modalRef = this.modalService.open(this.details, { fullscreen: true });

    this.route.params.subscribe((param) => {
      this.uiState.sno = +param["id"];
    });

    this.getClintDetails(this.uiState.sno);

    this.modalRef.hidden.subscribe(() => {
      this.router.navigate([{ outlets: { details: null } }]);
    });
  }

  getClintDetails(sno: number) {
    let sub = this.clintService.getClintDetails(sno).subscribe({
      next: (res: HttpResponse<IBaseResponse<IClient>>) => {
        console.log(res);
        this.uiState.clintDetails = res.body?.data!;
      },
      error: (error: HttpErrorResponse) => {
        this.message.popup("Oops!", error.message, "error");
      },
    });

    this.subscribes.push(sub);
  }

  ngOnDestroy() {
    this.subscribes.forEach((s) => s.unsubscribe());
  }
}
