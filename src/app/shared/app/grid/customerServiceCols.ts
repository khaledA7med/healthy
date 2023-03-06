import { ColDef } from "ag-grid-community";
import { CustomerServiceListControlsComponent } from "src/app/pages/customer-service/customer-service-list/customer-service-list-controls.component";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";

export const customerServiceManageCols: ColDef[] = [
	{
		colId: "action",
		cellRenderer: CustomerServiceListControlsComponent,
		pinned: "left",
		maxWidth: 80,
		sortable: false,
	},
	{
		headerName: "Endors. Type",
		field: "endorsType",
		minWidth: 120,
	},
	{
		headerName: "Branch",
		field: "branch",
	},
	{
		headerName: "Status",
		cellRenderer: StatusCellRender.customerServiceStatus,
		field: "status",
		minWidth: 120,
	},
	{
		headerName: "Duration - W.Days(s)",
		field: "duration",
		sortable: false,
		cellRenderer: GlobalCellRender.CSDurationChecker,
		// field: "savedDate",
		// valueFormatter: (params) => GlobalCellRender.getBusinessDateCount(new Date(params.value), new Date()),
		minWidth: 150,
	},
	{
		headerName: "Pending Reason",
		field: "requestStatusNote",
		minWidth: 130,
	},
	{
		headerName: "Request No.",
		field: "requestNo",
		minWidth: 130,
	},
	{
		headerName: "Client ID",
		field: "clientId",
	},
	{
		headerName: "Client Name",
		field: "clientName",
		minWidth: 130,
	},
	{
		headerName: "Policy No.",
		field: "policyNo",
	},
	// {
	// 	headerName: "ClientPsNo",
	// 	field: "clientPolicySno",
	// 	minWidth: 105,
	// },
	{
		headerName: "Insurance Company",
		field: "insurComp",
		minWidth: 160,
	},
	{
		headerName: "Class of Insurance",
		field: "classOfBusiness",
		minWidth: 160,
	},
	{
		headerName: "Net Premium",
		field: "netPremium",
		valueFormatter: GlobalCellRender.currencyFormater,
		cellClass: ["input-text-right"],
		minWidth: 140,
	},
	{
		headerName: "Policy Fees",
		field: "policyFees",
		valueFormatter: GlobalCellRender.currencyFormater,
		cellClass: ["input-text-right"],
		minWidth: 110,
	},
	{
		headerName: "Total Premium",
		field: "totalPremium",
		valueFormatter: GlobalCellRender.currencyFormater,
		cellClass: ["input-text-right"],
		minWidth: 140,
	},
	{
		headerName: "Saved By",
		field: "savedBy",
		minWidth: 140,
	},
	{
		headerName: "Saved On",
		field: "savedDate",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 150,
	},
	{
		headerName: "Notify Client",
		field: "notifyClient",
		cellRenderer: GlobalCellRender.NotifyChecker,
		minWidth: 150,
	},
	{
		headerName: "Notify Insurer",
		field: "notifyInsurer",
		cellRenderer: GlobalCellRender.NotifyChecker,
		minWidth: 140,
	},
	{
		headerName: "Cancellation Reason",
		field: "cancelationReason",
		minWidth: 140,
	},
	{
		headerName: "Closed / Cancelled By",
		field: "closedBy",
		sortable: false,
		// cellRenderer: (params: any) => (params.data.closedBy ? params.data.closedBy : params.data.canceledBy),
		// valueGetter: (params) => (params.data.closedBy ? params.data.closedBy : params.data.canceledBy),
		// valueFormatter: (params) => (params.data.closedBy ? params.data.closedBy : params.data.canceledBy),
		minWidth: 170,
	},
	{
		headerName: "Closed / Cancelled On",
		field: "closedOn",
		sortable: false,
		minWidth: 170,
		valueFormatter: GlobalCellRender.dateFormater,
	},
];
