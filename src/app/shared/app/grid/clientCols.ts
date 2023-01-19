import { ColDef } from "ag-grid-community";
import { ClientListControlsComponent } from "src/app/pages/clients/client-registry-list/client-registry-list/client-list-controls.component";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";

export const clientManageCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: ClientListControlsComponent,
    pinned: "left",
    maxWidth: 80,
    sortable: false,
  },
  {
    headerName: "Status",
    cellRenderer: StatusCellRender.clientStatus,
    field: "status",
  },
  {
    headerName: "Client ID",
    field: "sNo",
    sort: "asc",
  },
  {
    headerName: "Full Name",
    field: "fullName",
  },
  {
    headerName: "Full Name (Ar)",
    field: "fullNameAr",
  },
  {
    headerName: "Producer (Salesman)",
    field: "producer",
  },
  {
    headerName: "Type",
    field: "type",
  },
  {
    headerName: "Created By",
    field: "createdBy",
  },
  {
    headerName: "Created On",
    field: "createdOn",
    valueFormatter: GlobalCellRender.dateFormater,
  },
  {
    headerName: "Approved By",
    field: "approvedBy",
  },
  {
    headerName: "Approved On",
    field: "approvedDate",
    valueFormatter: GlobalCellRender.dateFormater,
  },
];
