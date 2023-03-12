import { ColDef } from "ag-grid-community";

export const ActiveRequestsByClientsCols: ColDef[] = [
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
];

export const ActiveRequestsGropedByIcsCols: ColDef[] = [
  {
    headerName: "Insurance Company",
    field: "insuranceCompany",
  },
  {
    headerName: "No of Requests",
    field: "noOfRequests",
  },
];
