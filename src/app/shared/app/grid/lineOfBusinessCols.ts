import { ColDef } from "ag-grid-community";
import { LineOfBusinessFormComponent } from "src/app/pages/master-tables/line-of-business/line-of-business/line-of-business-form.component";

export const lineOfBusinessCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: LineOfBusinessFormComponent,
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
    headerName: "Class of Insurance",
    field: "className",
  },
  {
    headerName: "Line of Business",
    field: "lineofBusiness",
  },
  {
    headerName: "Line of Business(Ar)",
    field: "lineofBusinessAr",
  },
  {
    headerName: "Abbreviation",
    field: "abbreviation",
  },
];
