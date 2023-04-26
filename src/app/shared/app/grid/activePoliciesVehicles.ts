import { ColDef } from "ag-grid-community";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";

export const ActivePoliciesVehiclesCols: ColDef[] = [
	{
		headerName: "Owner / Driver",
		field: "ownerDriver",
		minWidth: 120,
	},
	{
		headerName: "Plate No",
		field: "plateNo",
		sort: "asc",
		minWidth: 120,
	},
	{
		headerName: "Plate Char 1",
		field: "plateChar1",
		minWidth: 120,
	},
	{
		headerName: "Plate Char 2",
		field: "plateChar2",
		minWidth: 120,
	},
	{
		headerName: "Plate Char 3",
		field: "plateChar3",
		minWidth: 120,
	},
	{
		headerName: "Sequence No",
		field: "sequenceNo",
		minWidth: 120,
	},
	{
		headerName: "Custom ID",
		field: "customID",
		minWidth: 120,
	},
	{
		headerName: "Brand Name",
		field: "brandName",
		minWidth: 120,
	},
	{
		headerName: "Model",
		field: "model",
		minWidth: 120,
	},
	{
		headerName: "Inception",
		field: "inception",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 120,
	},
	{
		headerName: "Expiry",
		field: "expiry",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 120,
	},
	{
		headerName: "Kcl Date",
		field: "kclDate",
		valueFormatter: GlobalCellRender.dateFormater,
		minWidth: 120,
	},
	{
		headerName: "Seats No",
		field: "seats",
		minWidth: 120,
	},
	{
		headerName: "Body Type",
		field: "bodyType",
		minWidth: 120,
	},
	{
		headerName: "Chassis No",
		field: "chassisNo",
		minWidth: 120,
	},
	{
		headerName: "Market Value",
		field: "marketValue",
		minWidth: 120,
	},
	{
		headerName: "Repair Type",
		field: "repairType",
		minWidth: 120,
	},
	{
		headerName: "Vehicle Owner ID",
		field: "vehicleOwnerID",
		minWidth: 120,
	},
	{
		headerName: "Project Name",
		field: "projectName",
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
