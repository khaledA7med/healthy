import { Component } from "@angular/core";

@Component({
  selector: "app-general-grid-menu",
  templateUrl: "./general-grid-menu.component.html",
  styleUrls: ["./general-grid-menu.component.scss"],
})
export class GeneralGridMenuComponent {
  private params: any;

  agInit(params: any) {
    this.params = params;
  }

  Edit() {
    console.log(this.params.data);
  }
}
