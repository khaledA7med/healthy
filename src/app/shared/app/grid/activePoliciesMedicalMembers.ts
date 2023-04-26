import { ColDef } from "ag-grid-community";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";

export const ActivePoliciesMedicalMembersCols: ColDef[] = [
	{
		headerName: "Id-Iqama No.",
		field: "idIqamaNo",
		minWidth: 120,
	},
	{
		headerName: "Membership No",
		field: "membershipNo",
		sort: "asc",
		minWidth: 120,
	},
	{
		headerName: "Member Name",
		field: "memberName",
		minWidth: 120,
	},
	{
		headerName: "DOB",
		field: "dob",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 120,
	},
	{
		headerName: "Relation",
		field: "relation",
		minWidth: 120,
	},
	{
		headerName: "Marital Status",
		field: "maritalStatus",
		minWidth: 120,
	},
	{
		headerName: "Gender",
		field: "gender",
		minWidth: 120,
	},
	{
		headerName: "Sponsor No",
		field: "sponsorNo",
		minWidth: 120,
	},
	{
		headerName: "Endt No",
		field: "endtNo",
		minWidth: 120,
	},
	{
		headerName: "Class",
		field: "class",
		minWidth: 120,
	},
	{
		headerName: "City",
		field: "city",
		minWidth: 120,
	},
	{
		headerName: "Staff No",
		field: "staffNo",
		minWidth: 120,
	},
	{
		headerName: "Premium",
		field: "premium",
		minWidth: 120,
	},
	{
		headerName: "Mobile No",
		field: "mobileNo",
		minWidth: 120,
	},
	{
		headerName: "Nationality",
		field: "nationality",
		minWidth: 120,
	},
	{
		headerName: "CCHI Status",
		field: "cchiStatus",
		minWidth: 120,
	},
	// {
	// 	headerName: "Saved By",
	// 	field: "savedBy",
	// 	minWidth: 150,
	// },
	// {
	// 	headerName: "Saved On",
	// 	field: "savedOn",
	// 	minWidth: 120,
	// 	valueFormatter: GlobalCellRender.dateFormater,
	// },
];
