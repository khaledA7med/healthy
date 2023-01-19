import { Component } from "@angular/core";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "app-general-grid-menu",
  templateUrl: "./general-grid-menu.component.html",
  styleUrls: ["./general-grid-menu.component.scss"],
})
export class GeneralGridMenuComponent {
  private params!: ICellRendererParams;

  agInit(params: ICellRendererParams) {
    this.params = params;
  }

  Edit() {
    console.log(this.params.data);
  }
}
