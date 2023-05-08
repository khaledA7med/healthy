import { ColDef } from "ag-grid-community";
import { CancellationReasonsFormsComponent } from "src/app/pages/master-tables/customer-service/cancellation-reasons/cancellation-reasons/cancellation-reasons-forms.component";

export const cancellationReasonsCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: CancellationReasonsFormsComponent,
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
    headerName: "Cancellation Reason",
    field: "cancelReason",
  },
];
