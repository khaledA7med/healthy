import { ColDef } from "ag-grid-community";
import { PolicyTypesFromsComponent } from "src/app/pages/master-tables/policy-types/policy-types/policy-types-froms.component";

export const policyTypesCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: PolicyTypesFromsComponent,
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
    headerName: "Policy Type",
    field: "policyType",
  },
];
