import { ColDef } from "ag-grid-community";
import { UserRolesManagementControlsComponent } from "src/app/pages/system-admin/user-privileges/user-roles-management-controls.component";

export const userRolesCols: ColDef[] = [
	{
		colId: "action",
		cellRenderer: UserRolesManagementControlsComponent,
		pinned: "left",
		maxWidth: 40,
		sortable: false,
	},
	{
		headerName: "Security Role",
		field: "securityRole",
		minWidth: 100,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Security Role Description	",
		field: "securityRoleDescription",
		minWidth: 110,
		cellStyle: { cursor: "pointer" },
	},
];
