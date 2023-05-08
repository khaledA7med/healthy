import { ColDef } from "ag-grid-community";
import { BusinessActivityFormsComponent } from "src/app/pages/master-tables/business-activity/business-activity/business-activity-forms.component";

export const businessActivityCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: BusinessActivityFormsComponent,
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
    headerName: "Business Activity",
    field: "businessActivity",
  },
];
