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
        field: "",
    },
    {
        headerName: "Pending Reason",
        field: "",
    },
    {
        headerName: "Request No.",
        field: "",
    },
    {
        headerName: "Client ID",
        field: "",
    },
    {
        headerName: "Client Name",
        field: "",
    },
    {
        headerName: "Policy No.",
        field: "",
    },
    {
        headerName: "ClientPsNo",
        field: "",
    },
    {
        headerName: "Insurance Company",
        field: "",
    },
    {
        headerName: "Class of Insrance",
        field: "",
    },
    {
        headerName: "Net Premium",
        field: "",
    },
    {
        headerName: "Policy Fees",
        field: "",
    },
    {
        headerName: "Total Premium",
        field: "",
    },
    {
        headerName: "Saved By",
        field: "",
    },
    {
        headerName: "Saved On",
        field: "",
    },
    {
        headerName: "Notify Client",
        field: "",
    },
    {
        headerName: "Notify Insurer",
        field: "",
    },
    {
        headerName: "Cancellation Reason",
        field: "",
    },
    {
        headerName: "Cloased/Cancelled By",
        field: "",
    },
    {
        headerName: "Closed/Cancelled On",
        field: "",
    }
];