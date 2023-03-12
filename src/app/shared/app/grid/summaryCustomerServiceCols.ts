import { ColDef } from "ag-grid-community";

export const ActiveRequestsByClientCols: ColDef[] = [
  {
    headerName: "Client ID",
    field: "clientID",
  },
  {
    headerName: "Client Name",
    field: "clientName",
    minWidth: 250,
  },
  {
    headerName: "No of Requests",
    field: "noOfRequests",
  },
  {
    headerName: "Producer",
    field: "producer",
    minWidth: 250,
  },
];

export const ActiveRequestsByInsuranceCompanyCols: ColDef[] = [
  {
    headerName: "Insurance Company",
    field: "insurComp",
  },
  {
    headerName: "No of Requests",
    field: "noOfRequests",
  },
];
