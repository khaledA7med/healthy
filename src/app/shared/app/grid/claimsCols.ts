import { ClaimsControlsComponent } from "./../../../pages/claims/claims-list/claims-controls.component";
import { ColDef } from "ag-grid-community";
import StatusCellRender from "./statusCellRender";
import GlobalCellRender from "./globalCellRender";
export const claimsManageCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: ClaimsControlsComponent,
    pinned: "left",
    maxWidth: 80,
    sortable: false,
  },
  {
    headerName: "Branch",
    field: "branch",
  },
  {
    headerName: "Claim No",
    field: "claimNo",
    minWidth: 200,
  },
  {
    headerName: "Status",
    cellRenderer: StatusCellRender.claimStatus,
    field: "status",
  },
  {
    headerName: "Sub Status",
    field: "claimStatusNotes",
    minWidth: 200,
  },
  {
    headerName: "Notify Client ",
    field: "notifyClient",
    cellRenderer: GlobalCellRender.NotifyChecker,
  },
  {
    headerName: "Notify Insurer",
    field: "notifyInsurer",
    cellRenderer: GlobalCellRender.NotifyChecker,
  },
  {
    headerName: "Client ID",
    field: "clientID",
  },
  {
    headerName: "Client Name",
    field: "clientName",
    minWidth: 200,
  },
  {
    headerName: "Plat No",
    field: "carNo",
    minWidth: 120,
  },
  {
    headerName: "Chassis No",
    field: "chassisNumber",
    minWidth: 200,
  },
  {
    headerName: "Shipment Name",
    field: "shipmentName",
    minWidth: 200,
  },
  {
    headerName: "model",
    field: "model",
    minWidth: 120,
  },
  {
    headerName: "insurance Company",
    field: "insuranceCompany",
    minWidth: 230,
  },
  {
    headerName: "Class Name",
    field: "className",
    minWidth: 120,
  },
  {
    headerName: "line Of Business",
    field: "lineofBusiness",
    minWidth: 230,
  },
  {
    headerName: "Policy No",
    field: "policyNo",
    minWidth: 280,
  },
  {
    headerName: "Member/Drive Name",
    field: "membName",
    minWidth: 230,
  },
  {
    headerName: "Claim Amount",
    field: "claimAmount",
    valueFormatter: GlobalCellRender.currencyFormater,
    minWidth: 150,
  },
  {
    headerName: "Paid Amount ",
    field: "amountPaid",
    valueFormatter: GlobalCellRender.currencyFormater,
    minWidth: 150,
  },
  {
    headerName: "Rejected",
    field: "amountRejected",
    valueFormatter: GlobalCellRender.currencyFormater,
    minWidth: 150,
  },
  {
    headerName: "Under Processing",
    field: "underProcessingAmount",
    valueFormatter: GlobalCellRender.currencyFormater,
    minWidth: 150,
  },
  {
    headerName: "Estimated Value",
    field: "estimatedValue",
    valueFormatter: GlobalCellRender.currencyFormater,
    minWidth: 150,
  },
  {
    headerName: "Total Approvals",
    field: "totalApprovals",
    valueFormatter: GlobalCellRender.currencyFormater,
    minWidth: 150,
  },
  {
    headerName: "Towing Changes (invoice)",
    field: "towingCharges",
    valueFormatter: GlobalCellRender.currencyFormater,
    minWidth: 150,
  },
  {
    headerName: "Amount Paid To Workshop",
    field: "totalPaidToWorkshop",
    valueFormatter: GlobalCellRender.currencyFormater,
    minWidth: 200,
  },
  {
    headerName: "Accident/Bill Date",
    field: "dateOfLoss",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 150,
  },
  {
    headerName: "Notification Date",
    field: "dateOfReceive",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 150,
  },
  {
    headerName: "Date Of Submission",
    field: "dateOfSubmission",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 150,
  },
  {
    headerName: "Date of Deadline",
    field: "dateOfDeadline",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 150,
  },
  {
    headerName: "Approval Data",
    field: "approvalDate",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 150,
  },
  {
    headerName: "Invoice Date",
    field: "invoiceDate",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 150,
  },
  {
    headerName: "Payment Date",
    field: "dateofPayment",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 150,
  },
  {
    headerName: "Ref#",
    field: "insurCompClaimNo",
    minWidth: 150,
  },
  {
    headerName: "Notes",
    field: "notes",
    minWidth: 150,
  },
  {
    headerName: "Created By ",
    field: "savedUser",
    minWidth: 150,
  },
  {
    headerName: "Created On",
    field: "savedDate",
    minWidth: 150,
  },
];