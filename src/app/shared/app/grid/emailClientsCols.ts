import { ColDef } from "ag-grid-community";

export const emailClientsCols: ColDef[] = [
	{
		headerName: "Client ID",
		field: "sNo",
		maxWidth: 100,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Client Name",
		field: "fullName",
		sort: "asc",
		minWidth: 110,
		cellStyle: { cursor: "pointer" },
	},
];
