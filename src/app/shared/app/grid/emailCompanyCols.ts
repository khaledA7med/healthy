import { ColDef, ValueFormatterParams } from "ag-grid-community";

export const emailCompanyCols: ColDef[] = [
	{
		headerName: "No.",
		field: "sNo",
		valueFormatter: (e: ValueFormatterParams) => {
			return (e.node?.rowIndex! + 1).toString();
		},
		maxWidth: 100,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Insurance Company Name",
		field: "name",
		sort: "asc",
		minWidth: 110,
		cellStyle: { cursor: "pointer" },
	},
];
