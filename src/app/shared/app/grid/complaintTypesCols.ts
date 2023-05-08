import { ComplaintsTypesFormsComponent } from "./../../../pages/master-tables/customer-service/complaints-types/complaints-types/complaints-types-forms.component";
import { ColDef } from "ag-grid-community";

export const complaintsTypesCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: ComplaintsTypesFormsComponent,
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
    headerName: "Complaint Type",
    field: "type",
  },
];
