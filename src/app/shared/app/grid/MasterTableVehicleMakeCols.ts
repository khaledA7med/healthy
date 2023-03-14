import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { VehiclesMakeListControlsComponent } from "src/app/pages/master-tables/production/vehicles-make/vehicles-make-list-controls.component";

export const VehicleMakeCols: ColDef[] = [
	{
		colId: "action",
		cellRenderer: VehiclesMakeListControlsComponent,
		pinned: "left",
		maxWidth: 80,
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
		headerName: "Make",
		field: "make",
	},
];
