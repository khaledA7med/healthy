import { ColDef } from "ag-grid-community";
import { LocationsFormsComponent } from "src/app/pages/master-tables/locations/locations/locations-forms.component";

export const locationsCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: LocationsFormsComponent,
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
    headerName: "Location Name",
    field: "locationName",
  },
];
