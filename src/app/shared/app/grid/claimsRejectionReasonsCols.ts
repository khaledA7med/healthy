import { ColDef } from "ag-grid-community";
import { ClaimsRejectionReasonsFormsComponent } from "src/app/pages/master-tables/claims/claims-rejection-reasons/claims-rejection-reasons/claims-rejection-reasons-forms.component";
ClaimsRejectionReasonsFormsComponent;
export const claimsRejectionReasonsCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: ClaimsRejectionReasonsFormsComponent,
    pinned: "left",
    maxWidth: 80,
    sortable: false,
  },
  {
    headerName: "No.",
    valueGetter: "node.rowIndex + 1",
  },
  {
    headerName: "Type",
    field: "type",
    minWidth: 320,
  },
  {
    headerName: "Rejection Reason",
    field: "rejectionReason",
    minWidth: 250,
  },
];
