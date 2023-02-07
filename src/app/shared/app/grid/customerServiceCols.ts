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
    },
    {
        headerName: "Branch",
        field: "branch",
    },
    {
        headerName: "Status",
        cellRenderer: StatusCellRender.clientStatus,
        field: "status",
    },
    {
        headerName: "Duration - W.Days(s)",
        field: "duration",
    },
    {
        headerName: "Pending Reason",
        field: "",
    },
    {
        headerName: "Request No.",
        field: "requestNo",
    },
    {
        headerName: "Client ID",
        field: "clientId",
    },
    {
        headerName: "Client Name",
        field: "clientName",
    },
    {
        headerName: "Policy No.",
        field: "policyNo",
    },
    {
        headerName: "ClientPsNo",
        field: "clientPolicySno",
    },
    {
        headerName: "Insurance Company",
        field: "insurComp",
    },
    {
        headerName: "Class of Insrance",
        field: "classOfBusiness",
    },
    {
        headerName: "Net Premium",
        field: "netPremium",
    },
    {
        headerName: "Policy Fees",
        field: "policyFees",
    },
    {
        headerName: "Total Premium",
        field: "totalPremium",
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
    },
    {
        headerName: "Notify Insurer",
        field: "notifyInsurer",
    },
    {
        headerName: "Cancellation Reason",
        field: "cancelationReason",
    },
    {
        headerName: "Closed/Cancelled By",
        field: "closedBy/canceledBy",
    },
    {
        headerName: "Closed/Cancelled On",
        field: "closedOn/canceledOn",
        valueFormatter: GlobalCellRender.dateFormater,

    }
];