import { ColDef } from "ag-grid-community";
import { PoliciesManagementControlsComponent } from "src/app/pages/production/policies-management/policies-management-controls.component";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";

export const productionCols: ColDef[] = [
	{
		colId: "action",
		cellRenderer: PoliciesManagementControlsComponent,
		pinned: "left",
		maxWidth: 80,
		sortable: false,
	},
	{
		headerName: "Delivery Status",
		field: "policyStatus",
		cellRenderer: StatusCellRender.salesLeadStatus,
	},
	{
		headerName: "Our Ref",
		field: "oasisPolRef",
		sort: "asc",
	},
	{
		headerName: "Branch",
		field: "branch",
	},
	{
		headerName: "Client ID",
		field: "clientNo",
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
		headerName: "Producer",
		field: "producer",
	},
	{
		headerName: "Issued By (Insurance Company)",
		field: "insurComp",
	},
	{
		headerName: "Class of Insurance",
		field: "className",
	},
	{
		headerName: "Line of Business",
		field: "lineOfBusiness",
	},
	{
		headerName: "A/C No",
		field: "accNo",
	},
	{
		headerName: "Policy No",
		field: "policyNo",
	},
	{
		headerName: "Endors No",
		field: "endorsNo",
	},
	{
		headerName: "Type",
		field: "endorsType",
	},
	{
		headerName: "Certificate No",
		field: "certificationNo",
	},
	{
		headerName: "Client DN/CN No",
		field: "clientDncnno",
	},
	{
		headerName: "Company Comm. DN/CN No",
		field: "compCommDncnno",
	},
	{
		headerName: "Sum Insured",
		field: "sumInsur",
	},
	{
		headerName: "Net Premium",
		field: "netPremium",
	},
	{
		headerName: "Fees",
		field: "fees",
	},
	{
		headerName: "Net Premium + Fees",
		field: "netPremium",
	},
	{
		headerName: "VAT %",
		field: "vatPerc",
	},
	{
		headerName: "VAT Amount",
		field: "vatValue",
	},
	{
		headerName: "Total Premium",
		field: "totalPremium",
	},

	{
		headerName: "Paid Premium",
		field: "paidPremium",
	},
	{
		headerName: "Outstanding Premium",
		field: "totalPremium",
	},
	{
		headerName: "Company Comm %",
		field: "compCommPerc",
	},
	{
		headerName: "Company Comm",
		field: "compComm",
	},
	{
		headerName: "Company Comm. VAT",
		field: "compCommVat",
	},
	{
		headerName: "Producer Comm %",
		field: "producerCommPerc",
	},
	{
		headerName: "Producer Comm.",
		field: "producerComm",
	},
	{
		headerName: "Issue Date",
		field: "issueDate",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Period From",
		field: "periodFrom",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Period To",
		field: "periodTo",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Saved By",
		field: "savedUser",
	},
	{
		headerName: "Saved On",
		field: "savedDate",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Prod. Approved By",
		field: "approvedUser",
	},
	{
		headerName: "Prod. Approved On",
		field: "approvedDate",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Fin. Approved By",
		field: "finApprovedUser",
	},
	{
		headerName: "Fin. Approved On",
		field: "finApprovedDate",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Fin. Entry Date",
		field: "finEntryDate",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Rejection Info",
		field: "finRejectInfo",
	},
	{
		headerName: "Rejection By",
		field: "finRejectBy",
	},
	{
		headerName: "Rejection On",
		field: "finRejectOn",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Delivery Updated By",
		field: "deliveryUpdatedBy",
	},
	{
		headerName: "Delivery Updated On",
		field: "deliveryUpdatedOn",
		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Correction By",
		field: "correctionBy",
	},
	{
		headerName: "Correction On",
		field: "correctionOn",
		valueFormatter: GlobalCellRender.dateFormater,
	},
];
