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
    field: "sNo",
    valueFormatter: (e: ValueFormatterParams) => {
      return (e.node?.rowIndex! + 1).toString();
    },
    minWidth: 100,
  },
  {
    headerName: "Policy Issue Types",
    field: "policyIssueType",
  },
  {
    headerName: "Doc. Name",
    field: "docName",
  },
];
