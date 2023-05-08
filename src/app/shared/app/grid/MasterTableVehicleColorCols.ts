import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { VehiclesColorListControlsComponent } from "src/app/pages/master-tables/production/vehicles-colors/vehicles-color-list-controls.component";

export const VehicleColorCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: VehiclesColorListControlsComponent,
    pinned: "left",
    maxWidth: 40,
    sortable: false,
  },
  {
    headerName: "No.",
    field: "sNo",
    valueFormatter: (e: ValueFormatterParams) => {
      return (e.node?.rowIndex! + 1).toString();
    },
    minWidth: 100,
  },
  {
    headerName: "Color",
    field: "color",
  },
];
