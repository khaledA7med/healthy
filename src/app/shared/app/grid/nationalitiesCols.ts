import { ColDef } from "ag-grid-community";
import { NationalitiesFormsComponent } from "src/app/pages/master-tables/nationalities/nationalities/nationalities-forms.component";

export const nationalitiesCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: NationalitiesFormsComponent,
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
    headerName: "Nationality",
    field: "nationality",
  },
];
