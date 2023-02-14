import { ColDef } from "ag-grid-community";

export const searchByRequestCols: ColDef[] = [
  {
    headerName: "Client ID",
    field: "clientID",
    minWidth: 130,
  },
  {
    headerName: "Client Name",
    field: "clientName",
    minWidth: 180,
  },
  {
    headerName: "Request No.",
    field: "requestNo",
    minWidth: 250,
  },
  {
    headerName: "Policy No.",
    field: "policyNo",
    minWidth: 250,
  },
  {
    headerName: "Class Of Business",
    field: "classOfBusiness",
    minWidth: 180,
  },
  {
    headerName: "Line Of Business",
    field: "lineOfBusiness",
    minWidth: 180,
  },
  {
    headerName: "Producer",
    field: "producer",
    minWidth: 130,
  },
  {
    headerName: "Endors Type",
    field: "endorsType",
    minWidth: 130,
  },
];

export const searchByClientCols: ColDef[] = [
  {
    headerName: "Client ID",
    field: "sNo",
    minWidth: 130,
  },
  {
    headerName: "Client Name",
    field: "fullName",
    minWidth: 130,
  },
  {
    headerName: "Producer",
    field: "producer",
    minWidth: 130,
  },
  {
    headerName: "Status",
    field: "status",
    minWidth: 130,
  },
];

export const searchPolicy: ColDef[] = [
  {
    headerName: "Policy No",
    field: "policyNo",
    minWidth: 130,
  },
  {
    headerName: "Insurance Company",
    field: "insurComp",
    minWidth: 130,
  },
  {
    headerName: "Account No",
    field: "accNo",
    minWidth: 130,
  },
  {
    headerName: "Class Name",
    field: "className",
    minWidth: 130,
  },
  {
    headerName: "Line Of Business	",
    field: "lineOfBusiness",
    minWidth: 130,
  },
  {
    headerName: "Period From",
    field: "periodFrom",
    minWidth: 130,
  },
  {
    headerName: "Period To",
    field: "periodTo",
    minWidth: 130,
  },
];
