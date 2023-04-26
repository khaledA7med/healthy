import { ColDef } from "ag-grid-community";
import { BusinessActivityFormsComponent } from "src/app/pages/master-tables/business-activity/business-activity/business-activity-forms.component";

export const businessActivityCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: BusinessActivityFormsComponent,
    pinned: "left",
    maxWidth: 80,
    sortable: false,
  },
  {
    headerName: "No.",
    valueGetter: "node.rowIndex + 1",
  },
  {
    headerName: "Business Activity",
    field: "businessActivity",
  },
];
