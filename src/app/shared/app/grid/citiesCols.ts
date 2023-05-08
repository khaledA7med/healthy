import { ColDef } from "ag-grid-community";
import { CitiesFormsComponent } from "src/app/pages/master-tables/cities/cities/cities-forms.component";

export const citiesCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: CitiesFormsComponent,
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
    headerName: "City Name",
    field: "city",
  },
];
