import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { ProductionDocumentsListControlsComponent } from "src/app/pages/master-tables/list-of-required-documents/production-documents/production-documents-list-controls.component";

export const PoliciesListOfDocumentseCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: ProductionDocumentsListControlsComponent,
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
    headerName: "Policy Issue Types",
    field: "policyIssueType",
  },
  {
    headerName: "Document Name",
    field: "docName",
  },
];
