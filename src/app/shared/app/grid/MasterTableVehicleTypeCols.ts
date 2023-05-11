import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { VehiclesTypeListControlsComponent } from "src/app/pages/master-tables/production/vehicles-type/vehicles-type-list-controls.component";

export const VehicleTypeCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: VehiclesTypeListControlsComponent,
    pinned: "left",
    maxWidth: 40,
    sortable: false,
  },
  {
    headerName: "No.",
    valueGetter: "node.rowIndex + 1",
    minWidth: 100,
  },
  {
    headerName: "Make",
    field: "make",
  },
  {
    headerName: "Type",
    field: "type",
  },
];
