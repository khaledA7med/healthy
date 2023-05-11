import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { ClaimsDocumentsListControlsComponent } from "src/app/pages/master-tables/list-of-required-documents/claims-documents/clients-documents-list-controls.component";

export const ClaimsListOfDocumentseCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: ClaimsDocumentsListControlsComponent,
    pinned: "left",
    maxWidth: 40,
    sortable: false,
  },
  {
    headerName: "No.",
    valueGetter: "node.rowIndex + 1",
    minWidth: 100,
  },
  {
    headerName: "Document Name",
    field: "docName",
  },
];
