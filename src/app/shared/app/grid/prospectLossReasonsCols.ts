import { ColDef } from "ag-grid-community";
import { ProspectLossReasonsFormsComponent } from "src/app/pages/master-tables/business-development/sales/prospect-loss-reasons/prospect-loss-reasons/prospect-loss-reasons-forms.component";

export const prospectLossReasonsCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: ProspectLossReasonsFormsComponent,
    pinned: "left",
    maxWidth: 40,
    sortable: false,
  },
  {
    headerName: "No.",
    valueGetter: "node.rowIndex + 1",
    minWidth: 70,
    maxWidth: 300,
  },
  {
    headerName: "Loss Reason",
    field: "reason",
  },
];
