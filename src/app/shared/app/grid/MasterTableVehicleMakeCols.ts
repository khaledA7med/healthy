import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { VehiclesMakeListControlsComponent } from "src/app/pages/master-tables/production/vehicles-make/vehicles-make-list-controls.component";

export const VehicleMakeCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: VehiclesMakeListControlsComponent,
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
    headerName: "Maker",
    field: "make",
  },
];
