import { ColDef } from "ag-grid-community";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";
import { ActiveListControlsComponent } from "src/app/pages/production/active-list/active-list/active-list-controls.component";

export const ActiveListCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: ActiveListControlsComponent,
    pinned: "left",
    maxWidth: 80,
    sortable: false,
  },
  {
    headerName: "Policy Status",
    field: "status",
    minWidth: 150,
    cellRenderer: StatusCellRender.ClientsPolicyStatus,
  },
  {
    headerName: "Oasis Pol Ref",
    field: "oasisPolRef",
    sort: "asc",
    minWidth: 150,
  },
  {
    headerName: "Client No.",
    field: "clientNo",
    minWidth: 115,
  },
  {
    headerName: "Client Name",
    field: "clientName",
    minWidth: 230,
  },
  {
    headerName: "Producer",
    field: "producer",
    minWidth: 200,
  },
  {
    headerName: "Insurance Company",
    field: "insurComp",
    minWidth: 280,
  },
  {
    headerName: "Class of Insurance",
    field: "className",
    minWidth: 170,
  },
  {
    headerName: "Line of Business",
    field: "lineOfBusiness",
    minWidth: 220,
  },
  {
    headerName: "Issue Date",
    field: "issueDate",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 120,
  },
  {
    headerName: "Period From",
    field: "periodFrom",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 120,
  },
  {
    headerName: "Period To",
    field: "periodTo",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 120,
  },
  {
    headerName: "producer Comm %",
    field: "producerCommPerc",
    minWidth: 160,
  },
  {
    headerName: "Company Comm %",
    field: "compCommPerc",
    minWidth: 160,
  },
  {
    headerName: "Cancelled",
    field: "cancelled",
    minWidth: 150,
  },
  {
    headerName: "Saved By",
    field: "savedBy",
    minWidth: 150,
  },
  {
    headerName: "Saved On",
    field: "savedOn",
    minWidth: 120,
    valueFormatter: GlobalCellRender.dateFormater,
  },
  {
    headerName: "Updated By",
    field: "updatedBy",
    minWidth: 150,
  },
  {
    headerName: "Updated On",
    field: "updatedOn",
    minWidth: 120,
    valueFormatter: GlobalCellRender.dateFormater,
  },
  {
    headerName: "Cancelled By",
    field: "cancelledUser",
    minWidth: 150,
  },
  {
    headerName: "Cancelled On",
    field: "cancelledDate",
    minWidth: 120,
    valueFormatter: GlobalCellRender.dateFormater,
  },
];
