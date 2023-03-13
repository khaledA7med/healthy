import { ColDef } from "ag-grid-community";

export const DebitCreditNotesCols: ColDef[] = [
	{
		headerName: "DocSNo",
		field: "docSNo",
		sort: "asc",
	},
	{
		headerName: "Client Name",
		field: "clientName",
	},

	{
		headerName: "Type",
		field: "type",
	},
	{
		headerName: "Source",
		field: "source",
	},
];
