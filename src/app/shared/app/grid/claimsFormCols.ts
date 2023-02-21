import { ColDef } from "ag-grid-community";

export const claimsPoliciesRequestCols: ColDef[] = [
  {
    headerName: "Our Ref",
    field: "oasisPolRef",
    minWidth: 180,
  },
  {
    headerName: "Client ID",
    field: "clientNo",
    minWidth: 130,
  },
  {
    headerName: "Client Name",
    field: "clientName",
    minWidth: 180,
  },
  {
    headerName: "Insurance Company",
    field: "insurComp",
    minWidth: 180,
  },
  {
    headerName: "Line Of Business",
    field: "lineOfBusiness",
    minWidth: 180,
  },
  {
    headerName: "Policy No.",
    field: "policyNo",
    minWidth: 180,
  },
];
