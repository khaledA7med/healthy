import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ColDef, Grid, GridApi, GridOptions } from "ag-grid-community";
import { MessagesService } from "src/app/shared/services/messages.service";
import { SweetAlertResult } from "sweetalert2";
// import { GridJs } from "../../../tables/gridjs/data";
import { GeneralGridMenuComponent } from "../general-grid-menu/general-grid-menu.component";
@Component({
  selector: "app-grid-view",
  templateUrl: "./grid-view.component.html",
  styleUrls: ["./grid-view.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class GridViewComponent implements OnInit {
  // Grid
  columnDef: ColDef[] = [];
  rowData: any = [];
  gridApi: GridApi = <GridApi>{};

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
  };
  constructor(private msg: MessagesService, private http: HttpClient) {
    this.columnDef = [
      {
        colId: "action",
        cellRenderer: GeneralGridMenuComponent,
        pinned: "left",
        editable: false,
        maxWidth: 80,
        cellClass: "actions-button-cell",
      },
      {
        headerName: "Title",
        field: "title",
      },
      {
        headerName: "Body",
        field: "body",
      },
      {
        headerName: "ID",
        field: "id",
      },
    ];
  }

  ngOnInit(): void {
    this.http
      .get("https://jsonplaceholder.typicode.com/posts")
      .subscribe((res) => {
        this.rowData = res;
      });
    // this.msg
    //   .confirm("Delete", undefined, undefined)
    //   .then((res: SweetAlertResult) => {
    //     console.log(res.isConfirmed);
    //   });

    // this.msg.popup("Title", "Message Content");
    // this.msg.toast("aaaa");
  }

  testSort(e: any) {
    console.log(e.columnApi.getColumnState());
  }

  onCellClicked(params: any) {
    if (
      params.event.target.dataset.action == "toggle" &&
      params.column.getColId() == "action"
    ) {
      params.api.getCellRendererInstances({
        rowNodes: [params.node],
        columns: [params.column],
      });
    }
  }
  onPageChange(params: any) {
    this.gridApi = params.api;

    console.log(params);
    // console.log(this.gridApi.paginationGetCurrentPage() + 1);
    this.gridApi.hideOverlay();
  }

  gridReady(param: any) {
    this.gridApi = param.api;
    this.gridApi.showLoadingOverlay();
  }
}
