import { ClaimsControlsComponent } from "./../../../pages/claims/claims-list/claims-controls.component";
import { ColDef } from "ag-grid-community";
export const claimsManageCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: ClaimsControlsComponent,
    pinned: "left",
    maxWidth: 80,
    sortable: false,
  },
  {
    headerName: "Branch",
    field: "branch",
  },
];
