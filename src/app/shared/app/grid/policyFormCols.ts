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
    field: "className",
    minWidth: 180,
  },
  {
    headerName: "Line Of Business",
    field: "lineofBusiness",
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
    field: "clientID",
    minWidth: 130,
  },
  {
    headerName: "Client Name",
    field: "clientName",
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
