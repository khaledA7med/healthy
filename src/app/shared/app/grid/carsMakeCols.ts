import { CarsMakeFormsComponent } from "./../../../pages/master-tables/claims/cars-make/cars-make/cars-make-forms.component";
import { ColDef } from "ag-grid-community";

export const carsMakeCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: CarsMakeFormsComponent,
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
    headerName: "Cars Maker",
    field: "carsMake",
  },
];
