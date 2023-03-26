import { ColDef } from "ag-grid-community";

export const emailClientContactsCols: ColDef[] = [
	// {
	// 	colId: "action",
	// 	cellRenderer: ClientListControlsComponent,
	// 	pinned: "left",
	// 	maxWidth: 80,
	// 	sortable: false,
	// },
	{
		headerName: "Name",
		field: "contactName",
		minWidth: 120,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Position",
		field: "position",
		minWidth: 140,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Tele",
		field: "tele",
		minWidth: 110,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Moblie",
		field: "mobile",
		minWidth: 110,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Email",
		field: "email",
		minWidth: 150,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Line Of Business",
		field: "lineOfBusiness",
		minWidth: 110,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Branch",
		field: "branch",
		minWidth: 140,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Department",
		field: "department",
		minWidth: 110,
		cellStyle: { cursor: "pointer" },
	},
];
