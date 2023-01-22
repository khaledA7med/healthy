// import { ClientDetails, iAddClient } from './../../../shared/app/models/Clients/iAddClient';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessagesService } from "src/app/shared/services/messages.service";
// import { Subscription } from "rxjs";
import { ToastService } from "src/app/account/login/toast-service";
import { ClientsService } from 'src/app/shared/services/clients/clients.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
 
@Component({
  selector: "app-client-registry-forms",
  templateUrl: "./client-registry-forms.component.html",
  styleUrls: ["./client-registry-forms.component.scss"],
})


export class ClientRegistryFormsComponent implements OnInit {

	guestForm!:FormGroup;
  	closeResult = '';


  constructor(
    private route: ActivatedRoute,
	private formBuilder:FormBuilder,
    // private ClientsService:ClientsService,
    // private router: Router,
    public toastMessgae: ToastService,
    public message: MessagesService,
    private modalService: NgbModal
  ) { }

 
  openContact(content1:any) {
		this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  openBankAccount(content2:any) {
		this.modalService.open(content2, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

  ngOnInit(): void {
    this.route.paramMap.subscribe((res) => {
      console.log(res.get("id"));
    });

	this.guestForm = this.formBuilder.group({
		fullName: [null, Validators.required]
	});
  }
}
