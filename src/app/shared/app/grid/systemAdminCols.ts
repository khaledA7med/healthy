import { ColDef } from "ag-grid-community";
import { UserAccountsManagementControlsComponent } from "src/app/pages/system-admin/user-accounts-management/user-accounts-management-controls.component";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";

export const systemAdminCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: UserAccountsManagementControlsComponent,
        pinned: "left",
        maxWidth: 80,
        sortable: false,
    },
    {
        headerName: "Status",
        cellRenderer: StatusCellRender.systemAdminStatus,
        field: "status",
        minWidth: 200,
    },
    {
        headerName: "User ID",
        field: "sno",
        sort: "asc",
        minWidth: 130,
    },
    {
        headerName: "User Name",
        field: "userName",
        minWidth: 200,
    },
    {
        headerName: "Staff ID",
        field: "staffId",
    },
    {
        headerName: "Full Name",
        field: "fullName",
        minWidth: 250,
    },
    {
        headerName: "Job Title",
        field: "jobTitle",
        minWidth: 250,
    },
    {
        headerName: "phone No.",
        field: "phoneNo",
        minWidth: 250,
    },
    {
        headerName: "Email",
        field: "email",
        minWidth: 250,
    },
    {
        headerName: "Branch",
        field: "branch",
        valueFormatter: GlobalCellRender.dateFormater,
        minWidth: 150,
    },
    {
        headerName: "Division",
        field: "costCentersDivision",
        minWidth: 250,
    },
    {
        headerName: "Department",
        field: "costCentersDepartment",
        minWidth: 150,
    },
    {
        headerName: "Created By",
        field: "savedUser",
        minWidth: 150,
    },
    {
        headerName: "Created On",
        valueFormatter: GlobalCellRender.dateFormater,
        field: "savedDate",
    },
    {
        headerName: "Last Updated By",
        field: "updateUser",
    },
    {
        headerName: "Last Updated On",
        valueFormatter: GlobalCellRender.dateFormater,
        field: "updateDate",
    },
    {
        headerName: "Last Login On",
        field: "lastLogin",
        valueFormatter: GlobalCellRender.dateFormater,
    },
];
