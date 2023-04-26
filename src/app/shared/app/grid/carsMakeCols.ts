import { CarsMakeFormsComponent } from "./../../../pages/master-tables/claims/cars-make/cars-make/cars-make-forms.component";
import { ColDef } from "ag-grid-community";

export const carsMakeCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: CarsMakeFormsComponent,
    pinned: "left",
    maxWidth: 80,
    sortable: false,
  },
  {
    headerName: "No.",
    valueGetter: "node.rowIndex + 1",
  },
  {
    headerName: "Cars Make",
    field: "carsMake",
  },
];
