import { ColDef } from "ag-grid-community";
import { LegalStatusFormsComponent } from "src/app/pages/master-tables/legal-status/legal-status/legal-status-forms.component";

export const legalStatusCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: LegalStatusFormsComponent,
    pinned: "left",
    maxWidth: 80,
    sortable: false,
  },
  {
    headerName: "No.",
    valueGetter: "node.rowIndex + 1",
    minWidth: 70,
    maxWidth: 300,
  },
  {
    headerName: "Legal Status",
    field: "legalStatus",
  },
];
