import { ColDef } from "ag-grid-community";
import { UserAccountsManagementControlsComponent } from "src/app/pages/system-admin/user-accounts-management/user-accounts-management-controls.component";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";

export const systemAdminCols: ColDef[] = [
	{
		colId: "action",
		cellRenderer: UserAccountsManagementControlsComponent,
		pinned: "left",
		maxWidth: 40,
		sortable: false,
	},
	{
		headerName: "Status",
		cellRenderer: StatusCellRender.systemAdminStatus,
		field: "status",
		minWidth: 100,
	},
	{
		headerName: "User ID",
		field: "sno",
		sort: "asc",
		minWidth: 110,
	},
	{
		headerName: "User Name",
		field: "userName",
		minWidth: 130,
	},
	{
		headerName: "Staff ID",
		field: "staffId",
	},
	{
		headerName: "Full Name",
		field: "fullName",
		minWidth: 200,
	},
	{
		headerName: "Job Title",
		field: "jobTitle",
		minWidth: 200,
	},
	{
		headerName: "phone No.",
		field: "phoneNo",
		minWidth: 150,
	},
	{
		headerName: "Email",
		field: "email",
		minWidth: 200,
	},
	{
		headerName: "Branch",
		field: "branch",
		minWidth: 110,
	},
	{
		headerName: "Division",
		field: "costCentersDivision",
		minWidth: 140,
	},
	{
		headerName: "Department",
		field: "costCentersDepartment",
		minWidth: 130,
	},
	{
		headerName: "Created By",
		field: "savedUser",
		minWidth: 180,
	},
	{
		headerName: "Created On",
		valueFormatter: GlobalCellRender.dateFormater,
		field: "savedDate",
		minWidth: 150,
	},
	{
		headerName: "Last Updated By",
		field: "updateUser",
		minWidth: 150,
	},
	{
		headerName: "Last Updated On",
		valueFormatter: GlobalCellRender.dateFormater,
		field: "updateDate",
		minWidth: 150,
	},
	{
		headerName: "Last Login On",
		field: "lastLogin",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 150,
	},
];
