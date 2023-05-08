import { ColDef } from "ag-grid-community";
import { EmailContactListControlsComponent } from "../../components/email/client-contacts/client-list-controls.component";

export const emailCompanyContactsCols: ColDef[] = [
	{
		colId: "action",
		cellRenderer: EmailContactListControlsComponent,
		pinned: "left",
		maxWidth: 40,
		sortable: false,
	},
	{
		headerName: "Name",
		field: "contactName",
		minWidth: 120,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Position",
		field: "contactPosition",
		minWidth: 140,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Tele",
		field: "contactTele",
		minWidth: 110,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Moblie",
		field: "contactMobileNo",
		minWidth: 110,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Email",
		field: "contactEmail",
		minWidth: 150,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Line Of Business",
		field: "lineOfBusiness",
		minWidth: 110,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Branch",
		field: "branch",
		minWidth: 140,
		cellStyle: { cursor: "pointer" },
	},
	{
		headerName: "Department",
		field: "department",
		minWidth: 110,
		cellStyle: { cursor: "pointer" },
	},
];
