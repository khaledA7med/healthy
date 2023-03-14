import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { LifePlanListControlsComponent } from "src/app/pages/master-tables/production/life-plan/life-plan-list-controls.component";
import GlobalCellRender from "./globalCellRender";

export const masterTableLifePlanCols: ColDef[] = [
	{
		colId: "action",
		cellRenderer: LifePlanListControlsComponent,
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
		headerName: "Insurance Company",
		field: "insuranceCompany",
		minWidth: 100,
	},
	{
		headerName: "Plan",
		field: "planName",
	},
];
