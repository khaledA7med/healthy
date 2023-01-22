import { ColDef } from "ag-grid-community";
import { ClientGroupListControlsComponent } from "src/app/pages/clients/client-group/client-group-list-controls.component";
import { GroupClientsListControlsComponent } from "src/app/pages/clients/client-group/groups-clients/group-clients-list-controls.component";

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

export const groupClientsCols: ColDef[] = [
	{
		colId: "action",
		cellRenderer: GroupClientsListControlsComponent,
		pinned: "left",
		maxWidth: 80,
		sortable: false,
	},
	{
		headerName: "ID",
		field: "clientID",
		sortable: false,
	},
	{
		headerName: "Client Name",
		field: "clientName",
		sortable: false,
	},
];
