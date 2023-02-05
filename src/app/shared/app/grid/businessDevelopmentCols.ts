import { ColDef } from "ag-grid-community";
import { BusinessDevelopmentControlsComponent } from "src/app/pages/business-development/business-development-management/business-development-controls.component";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";

export const businessDevelopmentCols: ColDef[] = [
	{
		colId: "action",
		cellRenderer: BusinessDevelopmentControlsComponent,
		pinned: "left",
		maxWidth: 80,
		sortable: false,
	},
	{
		headerName: "Status",
		cellRenderer: StatusCellRender.salesLeadStatus,
		field: "status",
	},
	{
		headerName: "Lead Type",
		field: "leadType",
		sort: "asc",
	},
	{
		headerName: "Lead No.",
		field: "leadNo",
	},
	{
		headerName: "Client ID",
		field: "clientID",
	},
	{
		headerName: "Client Name",
		field: "name",
	},
	{
		headerName: "Producer",
		field: "producer",
	},
	{
		headerName: "Class of Business",
		field: "classOfBusiness",
	},
	{
		headerName: "Line of Business",
		field: "lineOfBusiness",
	},
	{
		headerName: "Deadline",
		field: "deadline",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Current Insurer",
		field: "currentInsurer",
	},
	{
		headerName: "Expiry Date",
		field: "existingPolExpDate",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Quoted Date",
		field: "quoatationDate",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Quoted Premium",
		field: "quoatedPremium",
	},
	{
		headerName: "Revised Quotation Date",
		field: "revisedQuoatationDate",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Revised Quotation Premium",
		field: "revisedQuoatationPremium",
	},
	{
		headerName: "Client Result",
		field: "clientResult",
	},
	{
		headerName: "Client Result Date",
		field: "clientResultDate",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Client Result Premium",
		field: "clientResultPremium",
	},
	{
		headerName: "Reason",
		field: "reason",
	},
	{
		headerName: "Created By",
		field: "savedBy",
	},
	{
		headerName: "Created On",
		field: "savedDate",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Updated By",
		field: "updatedBy",
	},
	{
		headerName: "Updated On",
		field: "updatedOn",
		valueFormatter: GlobalCellRender.dateFormater,
	},
];
