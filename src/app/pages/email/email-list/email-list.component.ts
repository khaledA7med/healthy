import { IEmailData } from "./../../../shared/app/models/Email/email-data";
import { ElementRef, HostListener, ViewChild } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { EmailModalComponent } from "src/app/shared/components/email/email-modal/email-modal.component";

@Component({
  selector: "app-email-list",
  templateUrl: "./email-list.component.html",
  styleUrls: ["./email-list.component.scss"],
})
export class EmailListComponent implements OnInit {
  uiState = {
    isMenuBar: false,
    isPrimary: true,
    isSocial: false,
    isPromotions: false,
    allMailList: [] as IEmailData[],
    socialMailList: [] as IEmailData[],
    promotionMailList: [] as IEmailData[],
  };
  data = {
    primary: [
      {
        id: 1,
        date: "Mar 7",
        description: "Trip home from Colombo has been arranged",
        labeltype: "Support",
        name: "Peter, me",
        readed: true,
        starred: true,
        tabtype: "Inbox",
        title: "Hello",
        userImg: "/assets/images/users/avatar-2.jpg",
      },
    ],
    social: [
      {
        id: 2,
        date: "Mar 8",
        description: "Trip home from Colombo has been arranged Social",
        labeltype: "Support",
        name: "Peter, me",
        readed: true,
        starred: false,
        tabtype: "Inbox",
        title: "Hello",
        userImg: "/assets/images/users/avatar-2.jpg",
      },
    ],
    promotion: [
      {
        id: 3,
        date: "Mar 9",
        description: "Trip home from Colombo has been arranged promotion",
        labeltype: "Support",
        name: "Peter, me",
        readed: true,
        starred: true,
        tabtype: "inbox",
        title: "Hello",
        userImg: "/assets/images/users/avatar-2.jpg",
      },
    ],
  };
  @ViewChild(EmailModalComponent) emailModal!: EmailModalComponent;
  @ViewChild("sideBar") sideBar!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    this.uiState.allMailList = this.data?.primary;
  }
  //#region new Email
  openModal() {
    this.emailModal.openModal();
  }
  //#endregion

  //#region side Bar
  showSideBar() {
    let menuBarShow =
      this.sideBar.nativeElement.classList.contains("menubar-show");
    if (!menuBarShow) this.sideBar.nativeElement.classList.add("menubar-show");
    this.uiState.isMenuBar = true;
  }
  @HostListener("document:click")
  Click() {
    let menuBarShow =
      this.sideBar.nativeElement.classList.contains("menubar-show");
    if (menuBarShow) {
      if (!this.uiState.isMenuBar)
        this.sideBar.nativeElement.classList.remove("menubar-show");
      this.uiState.isMenuBar = false;
    }
  }
  //#endregion
  //#region tab list
  toggleNavItem(name: string) {
    switch (name) {
      case "primary":
        this.uiState.isPrimary = true;
        this.uiState.isSocial = false;
        this.uiState.isPromotions = false;
        this.uiState.allMailList = this.data.primary;

        break;
      case "social":
        this.uiState.isPrimary = false;
        this.uiState.isSocial = true;
        this.uiState.isPromotions = false;
        this.uiState.allMailList = this.data.social;

        break;
      case "promotions":
        this.uiState.isPrimary = false;
        this.uiState.isSocial = false;
        this.uiState.isPromotions = true;
        this.uiState.allMailList = this.data.promotion;

        break;
      default:
        return;
    }
  }

  //#endregion
}
