import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { ClientsDocumentsListControlsComponent } from "src/app/pages/master-tables/list-of-required-documents/clients-documents/clients-documents-list-controls.component";

export const ClientsListOfDocumentseCols: ColDef[] = [
	{
		colId: "action",
		cellRenderer: ClientsDocumentsListControlsComponent,
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
		headerName: "Doc. Name",
		field: "docName",
	},
];
