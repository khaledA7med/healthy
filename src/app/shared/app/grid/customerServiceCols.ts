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
        minWidth: 120
    },
    {
        headerName: "Branch",
        field: "branch",
    },
    {
        headerName: "Status",
        cellRenderer: StatusCellRender.customerServiceStatus,
        field: "status",
    },
    {
        headerName: "Duration - W.Days(s)",
        field: "duration",
        minWidth: 150
    },
    {
        headerName: "Pending Reason",
        field: "pendingReason",
        minWidth: 130
    },
    {
        headerName: "Request No.",
        field: "requestNo",
        minWidth: 130
    },
    {
        headerName: "Client ID",
        field: "clientId",
    },
    {
        headerName: "Client Name",
        field: "clientName",
        minWidth: 130
    },
    {
        headerName: "Policy No.",
        field: "policyNo",
    },
    {
        headerName: "ClientPsNo",
        field: "clientPolicySno",
        minWidth: 105
    },
    {
        headerName: "Insurance Company",
        field: "insurComp",
        minWidth: 140
    },
    {
        headerName: "Class of Insurance",
        field: "classOfBusiness",
        minWidth: 140
    },
    {
        headerName: "Net Premium",
        field: "netPremium",
        minWidth: 110
    },
    {
        headerName: "Policy Fees",
        field: "policyFees",
        minWidth: 110
    },
    {
        headerName: "Total Premium",
        field: "totalPremium",
        minWidth: 110
    },
    {
        headerName: "Saved By",
        field: "savedBy",
    },
    {
        headerName: "Saved On",
        field: "savedDate",
        valueFormatter: GlobalCellRender.dateFormater,
    },
    {
        headerName: "Notify Client",
        field: "notifyClient",
        minWidth: 110
    },
    {
        headerName: "Notify Insurer",
        field: "notifyInsurer",
        minWidth: 110
    },
    {
        headerName: "Cancellation Reason",
        field: "cancelationReason",
        minWidth: 150
    },
    {
        headerName: "Closed/Cancelled By",
        field: "closedBy/canceledBy",
        minWidth: 170
    },
    {
        headerName: "Closed/Cancelled On",
        field: "closedOn/canceledOn",
        minWidth: 170,
        valueFormatter: GlobalCellRender.dateFormater

    }
];