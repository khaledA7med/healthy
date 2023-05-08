import { ColDef } from "ag-grid-community";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";
import { ActiveListManagementControlsComponent } from "src/app/pages/production/active-list-management/active-list-management-controls.component";

export const ActiveListCols: ColDef[] = [
	{
		colId: "action",
		cellRenderer: ActiveListManagementControlsComponent,
		pinned: "left",
		maxWidth: 40,
		sortable: false,
	},
	{
		headerName: "Policy Status",
		field: "status",
		minWidth: 120,
		cellRenderer: StatusCellRender.policyStatus,
	},
	{
		headerName: "Our Ref",
		field: "oasisPolRef",
		sort: "asc",
		minWidth: 210,
	},
	{
		headerName: "Client ID",
		field: "clientNo",
		minWidth: 115,
	},
	{
		headerName: "Client Name",
		field: "clientName",
		minWidth: 230,
	},
	{
		headerName: "Producer",
		field: "producer",
		minWidth: 200,
	},
	{
		headerName: "Policy No",
		field: "policyNo",
		minWidth: 180,
	},
	{
		headerName: "Issued By (Insurance Company)",
		field: "insurComp",
		minWidth: 280,
	},
	{
		headerName: "Class of Insurance",
		field: "className",
		minWidth: 170,
	},
	{
		headerName: "Line of Business",
		field: "lineOfBusiness",
		minWidth: 220,
	},
	{
		headerName: "Company Comm %",
		field: "compCommPerc",
		minWidth: 160,
	},
	{
		headerName: "Producer Comm %",
		field: "producerCommPerc",
		minWidth: 180,
	},
	{
		headerName: "Issue Date",
		field: "issueDate",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 120,
	},
	{
		headerName: "Cancelled",
		field: "cancelled",
		cellRenderer: GlobalCellRender.NotifyChecker,
		minWidth: 120,
	},
	{
		headerName: "Period From",
		field: "periodFrom",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 120,
	},
	{
		headerName: "Period To",
		field: "periodTo",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 120,
	},
	{
		headerName: "Saved By",
		field: "savedBy",
		minWidth: 150,
	},
	{
		headerName: "Saved On",
		field: "savedOn",
		minWidth: 120,
		valueFormatter: GlobalCellRender.dateFormater,
	},
	// ---------------------------
	{
		headerName: "Updated By",
		field: "updatedBy",
		minWidth: 150,
	},
	{
		headerName: "Updated On",
		field: "updatedOn",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 150,
	},
	{
		headerName: "Cancelled By",
		field: "cancelledUser",
		minWidth: 150,
	},
	{
		headerName: "Cancelled On",
		field: "cancelledDate",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 150,
	},
];

// Cancelled;
