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
    minWidth: 80,
    maxWidth: 80,
  },
  {
    headerName: "Full Name",
    field: "fullName",
    minWidth: 200,
  },
  {
    headerName: "Producer (Salesman)",
    field: "producer",
    minWidth: 200,
  },
  {
    headerName: "Type",
    field: "type",
    minWidth: 80,
    maxWidth: 80,
  },
  {
    headerName: "Created By",
    field: "createdBy",
    minWidth: 180,
  },
  {
    headerName: "Created On",
    field: "createdOn",
    valueFormatter: GlobalCellRender.dateTimeFormater,
    minWidth: 120,
  },
  {
    headerName: "Approved By",
    field: "approvedBy",
    minWidth: 150,
  },
  {
    headerName: "Approved On",
    field: "approvedDate",
    valueFormatter: GlobalCellRender.dateTimeFormater,
    minWidth: 120,
  },
];
