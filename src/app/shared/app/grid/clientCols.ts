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
    minWidth: 100,
    maxWidth: 100,
  },
  {
    headerName: "Client ID",
    field: "sNo",
    sort: "asc",
    minWidth: 120,
  },
  {
    headerName: "Full Name",
    field: "fullName",
    minWidth: 280,
  },
  {
    headerName: "Producer (Salesman)",
    field: "producer",
    minWidth: 280,
  },
  {
    headerName: "Type",
    field: "type",
    minWidth: 150,
  },
  {
    headerName: "Created By",
    field: "createdBy",
    minWidth: 250,
  },
  {
    headerName: "Created On",
    field: "createdOn",
    valueFormatter: GlobalCellRender.dateTimeFormater,
    minWidth: 180,
  },
  {
    headerName: "Approved By",
    field: "approvedBy",
    minWidth: 200,
  },
  {
    headerName: "Approved On",
    field: "approvedDate",
    valueFormatter: GlobalCellRender.dateTimeFormater,
    minWidth: 180,
  },
];
