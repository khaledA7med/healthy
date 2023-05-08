import { ComplaintsSuspectiveCausesFormsComponent } from "./../../../pages/master-tables/customer-service/complaints-suspective-causes/complaints-suspective-causes/complaints-suspective-causes-forms.component";
import { ColDef } from "ag-grid-community";

export const complaintsSuspectiveCausesCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: ComplaintsSuspectiveCausesFormsComponent,
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
    headerName: "Suspective Cause",
    field: "suspectiveCause",
  },
];
