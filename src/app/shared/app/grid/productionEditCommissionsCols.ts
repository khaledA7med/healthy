import { ColDef } from "ag-grid-community";
import { refundChecker } from "../models/Production/production-util";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";
import { CellEvent } from "ag-grid-community";
import { formatCurrency } from "@angular/common";
import { PoliciesEditCommissionsControlsComponent } from "src/app/pages/production/policies-edit-commissions/policies-edit-commissions-controls.component";

export const productionEditCommissionCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: PoliciesEditCommissionsControlsComponent,
    pinned: "left",
    maxWidth: 40,
    sortable: false,
  },
  {
    headerName: "Client ID",
    field: "sNo",
    sort: "asc",
  },
  {
    headerName: "Client Name",
    field: "clientName",
    minWidth: 200,
  },
  {
    headerName: "Producer",
    field: "producer",
    minWidth: 120,
  },
  {
    headerName: "Insurance Company",
    field: "insurComp",
    minWidth: 120,
  },
  {
    headerName: "Client Of Insurance",
    field: "className",
    minWidth: 180,
  },
  {
    headerName: "A/C No.",
    field: "accNo",
  },
  {
    headerName: "Policy No.",
    field: "policyNo",
  },
  {
    headerName: "Comp. Comp %",
    field: "compCommPerc",
    minWidth: 120,
  },
  {
    headerName: "Prod. Comp. %",
    field: "producerCommPerc",
    minWidth: 120,
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
];
