import { ColDef } from "ag-grid-community";
import { ClientListControlsComponent } from "src/app/pages/clients/client-registry-list/client-registry-list/client-list-controls.component";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";

export const clientManageCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: ClientListControlsComponent,
    pinned: "left",
    maxWidth: 40,
    sortable: false,
  },
  {
    headerName: "Client ID",
    field: "sNo",
    sort: "asc",
    minWidth: 80,
    maxWidth: 80,
  },
  {
    headerName: "Status",
    cellRenderer: StatusCellRender.clientStatus,
    field: "status",
    minWidth: 70,
  },
  {
    headerName: "Full Name",
    field: "fullName",
    minWidth: 200,
  },
  {
    headerName: "Account No. Premium",
    field: "accNoPremium",
    minWidth: 140,
  },
  {
    headerName: "Account No. VAT",
    field: "accNoVAT",
    minWidth: 120,
  },
  {
    headerName: "Type",
    field: "type",
    minWidth: 80,
    maxWidth: 80,
  },
  {
    headerName: "Branch",
    field: "branch",
    minWidth: 80,
  },
  {
    headerName: "Producer (Salesman)",
    field: "producer",
    minWidth: 170,
  },
  {
    headerName: "Account Manager",
    field: "accountManager",
    minWidth: 100,
  },
  {
    headerName: "CR No.",
    field: "commericalNo",
    minWidth: 100,
  },
  {
    headerName: "Unified No.",
    field: "unifiedNo",
    minWidth: 100,
  },
  {
    headerName: "Account Group",
    field: "accountGroup",
    minWidth: 100,
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
    minWidth: 130,
    type: "date",
  },
  {
    headerName: "Rejection Reason",
    field: "rejectionReason",
    minWidth: 180,
  },
  {
    headerName: "Rejected On",
    field: "rejectionDate",
    valueFormatter: GlobalCellRender.dateTimeFormater,
    minWidth: 130,
    type: "date",
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
    minWidth: 130,
    type: "date",
  },
];

export const columnsToExport = [
  "sNo",
  "status",
  "fullName",
  "accNoPremium",
  "accNoVAT",
  "type",
  "branch",
  "producer",
  "accountManager",
  "commericalNo",
  "unifiedNo",
  "accountGroup",
  "createdBy",
  "createdOn",
  "rejectionReason",
  "rejectionDate",
  "approvedBy",
  "approvedDate",
];
