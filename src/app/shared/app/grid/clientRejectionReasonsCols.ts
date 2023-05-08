import { ColDef } from "ag-grid-community";
import { ClientRejectionReasonsFormsComponent } from "src/app/pages/master-tables/business-development/cancellation-rejection-reasons/client-rejection-reasons/client-rejection-reasons/client-rejection-reasons-forms.component";

export const ClientRejectionReasonsCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: ClientRejectionReasonsFormsComponent,
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
    headerName: "Client Rejection Reason",
    field: "reason",
  },
];
