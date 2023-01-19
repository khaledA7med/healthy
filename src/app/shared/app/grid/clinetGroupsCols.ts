import { ColDef } from "ag-grid-community";
import { ClientGroupListControlsComponent } from "src/app/pages/clients/client-group/client-group-list-controls.component";

export const clientGroupsCols: ColDef[] = [
	{
		colId: "action",
		cellRenderer: ClientGroupListControlsComponent,
		pinned: "left",
		maxWidth: 80,
		sortable: false,
	},
	{
		headerName: "Group Name",
		field: "groupName",
		sortable: false,
	},
];
