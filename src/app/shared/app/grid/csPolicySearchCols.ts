import { ColDef } from "ag-grid-community";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";

export const CSPoicySearchCols: ColDef[] = [
	{
		headerName: "Client ID",
		field: "clientNo",
		sort: "asc",
	},
	{
		headerName: "Client Name",
		field: "clientName",
	},

	{
		headerName: "Policy Holder",
		field: "policyHolder",
	},
	{
		headerName: "Insurance Company",
		field: "insurComp",
	},
	{
		headerName: "Class of Bussiness",
		field: "className",
	},
	{
		headerName: "Line of Bussiness",
		field: "lineOfBusiness",
	},
	{
		headerName: "Policy No.",
		field: "policyNo",
	},
	{
		headerName: "Inception",
		field: "periodFrom",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Expiry",
		field: "periodTo",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Cancelled",
		field: "cancelled",
		cellRenderer: GlobalCellRender.CSCanceledFormater,
	},
];
