import { ColDef } from "ag-grid-community";
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
		headerName: "Insurance Company",
		field: "insuranceCompany",
		minWidth: 100,
	},
	{
		headerName: "Plan",
		field: "planName",
	},
];
