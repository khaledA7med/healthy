import { ColDef } from "ag-grid-community";
import { VehiclesTypesFormsComponent } from "src/app/pages/master-tables/vehicles-types/vehicles-types/vehicles-types-forms.component";

export const vehiclesTypesCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: VehiclesTypesFormsComponent,
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
    headerName: "Vehicle Type",
    field: "vehicleType",
  },
  {
    headerName: "Abbreviation",
    field: "abbreviation",
  },
];
