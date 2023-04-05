import { ColDef } from "ag-grid-community";

import { refundChecker } from "../models/Production/production-util";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";
import { CellEvent } from "ag-grid-community";
import { formatCurrency } from "@angular/common";
import { ActiveListManagementControlsComponent } from "src/app/pages/production/active-list-management/active-list-management-controls.component";

export const motorActiveListCols: ColDef[] = [
	{
		colId: "action",
		cellRenderer: ActiveListManagementControlsComponent,
		pinned: "left",
		maxWidth: 80,
		sortable: false,
	},
	{
		headerName: "Policy Status",
		field: "policyStatus",
		minWidth: 150,
		cellRenderer: StatusCellRender.policyStatus,
	},
	{
		headerName: "Delivery Status",
		field: "deliveryStatus",
		minWidth: 150,
	},
	{
		headerName: "Our Ref",
		field: "oasisPolRef",
		sort: "asc",
		minWidth: 200,
	},
	{
		headerName: "Branch",
		field: "branch",
		minWidth: 110,
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
		headerName: "Policy Holder",
		field: "policyHolder",
		minWidth: 180,
	},
	{
		headerName: "Producer",
		field: "producer",
		minWidth: 200,
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
		headerName: "A/C No",
		field: "accNo",
		minWidth: 140,
	},
	{
		headerName: "Policy No",
		field: "policyNo",
		minWidth: 180,
	},
	{
		headerName: "Endors No",
		field: "endorsNo",
		minWidth: 150,
	},
	{
		headerName: "Type",
		field: "endorsType",
		minWidth: 115,
	},
	{
		headerName: "Certificate No",
		field: "certificationNo",
		minWidth: 120,
	},
	{
		headerName: "Client DN/CN No",
		field: "clientDncnno",
		minWidth: 180,
	},
	{
		headerName: "Company Comm. DN/CN No",
		field: "compCommDncnno",
		minWidth: 180,
	},
	{
		headerName: "Sum Insured",
		field: "sumInsur",
		valueFormatter: GlobalCellRender.currencyFormater,
		cellClass: refundChecker,
		minWidth: 150,
	},
	{
		headerName: "Net Premium",
		field: "netPremium",
		valueFormatter: GlobalCellRender.currencyFormater,
		cellClass: refundChecker,
		minWidth: 150,
	},
	{
		headerName: "Fees",
		field: "fees",
		valueFormatter: GlobalCellRender.currencyFormater,
		cellClass: refundChecker,
	},
	{
		headerName: "Net Premium + Fees",
		field: "netPremium",
		cellRenderer: (params: CellEvent) => formatCurrency(+params.value + +params.data?.fees, "en-US", "", "", "1.2-2"),
		sortable: false,
		cellClass: refundChecker,
		minWidth: 150,
	},
	{
		headerName: "VAT %",
		field: "vatPerc",
	},
	{
		headerName: "VAT Amount",
		field: "vatValue",
		valueFormatter: GlobalCellRender.currencyFormater,
		cellClass: refundChecker,
		minWidth: 140,
	},
	{
		headerName: "Total Premium",
		field: "totalPremium",
		valueFormatter: GlobalCellRender.currencyFormater,
		cellClass: refundChecker,
		minWidth: 140,
	},
	{
		headerName: "Paid Premium",
		field: "paidPremium",
		valueFormatter: GlobalCellRender.currencyFormater,
		cellClass: refundChecker,
		minWidth: 140,
	},
	{
		headerName: "Outstanding Premium",
		field: "totalPremium",
		cellRenderer: (params: CellEvent) => formatCurrency(+params.value - +params.data?.paidPremium, "en-US", "", "", "1.2-2"),
		sortable: false,
		cellClass: refundChecker,
		minWidth: 180,
	},
	{
		headerName: "Company Comm %",
		field: "compCommPerc",
		minWidth: 160,
	},
	{
		headerName: "Company Comm",
		field: "compComm",
		valueFormatter: GlobalCellRender.currencyFormater,
		cellClass: refundChecker,
		minWidth: 160,
	},
	{
		headerName: "Company Comm. VAT",
		field: "compCommVat",
		valueFormatter: GlobalCellRender.currencyFormater,
		cellClass: refundChecker,
		minWidth: 180,
	},
	{
		headerName: "Producer Comm %",
		field: "producerCommPerc",
		minWidth: 180,
	},
	{
		headerName: "Producer Comm.",
		field: "producerComm",
		valueFormatter: GlobalCellRender.currencyFormater,
		cellClass: refundChecker,
		minWidth: 180,
	},
	{
		headerName: "Issue Date",
		field: "issueDate",
		valueFormatter: GlobalCellRender.dateFormater,
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
		field: "savedUser",
		minWidth: 150,
	},
	{
		headerName: "Saved On",
		field: "savedDate",
		minWidth: 120,

		valueFormatter: GlobalCellRender.dateFormater,
	},
	{
		headerName: "Prod. Approved By",
		field: "approvedUser",
		minWidth: 150,
	},
	{
		headerName: "Prod. Approved On",
		field: "approvedDate",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 120,
	},
	{
		headerName: "Fin. Approved By",
		field: "finApprovedUser",
		minWidth: 150,
	},
	{
		headerName: "Fin. Approved On",
		field: "finApprovedDate",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 120,
	},
	{
		headerName: "Fin. Entry Date",
		field: "finEntryDate",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 120,
	},
	{
		headerName: "Rejection Info",
		field: "finRejectInfo",
		minWidth: 120,
	},
	{
		headerName: "Rejection By",
		field: "finRejectBy",
		minWidth: 150,
	},
	{
		headerName: "Rejection On",
		field: "finRejectOn",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 120,
	},
	{
		headerName: "Delivery Updated By",
		field: "deliveryUpdatedBy",
		minWidth: 150,
	},
	{
		headerName: "Delivery Updated On",
		field: "deliveryUpdatedOn",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 120,
	},
	{
		headerName: "Correction By",
		field: "correctionBy",
		minWidth: 150,
	},
	{
		headerName: "Correction On",
		field: "correctionOn",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 120,
	},
];
