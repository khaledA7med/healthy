import { ColDef } from "ag-grid-community";
import { UsersManagementControlsComponent } from "src/app/pages/users/users-management/users-management-controls.component";

export const UsersCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: UsersManagementControlsComponent,
    pinned: "left",
    maxWidth: 40,
    sortable: false,
  },
  {
    headerName: "Client Id",
    field: "clientId",
  },
  {
    headerName: "Status",
    field: "status",
  },
  {
    headerName: "User Type",
    field: "userType",
  },
  {
    headerName: "Client Name",
    field: "clientName",
  },
  {
    headerName: "Email",
    field: "email",
  },
  {
    headerName: "First Name",
    field: "firstName",
  },
  {
    headerName: "Last Name",
    field: "surname",
  },
  {
    headerName: "Position",
    field: "position",
  },
  {
    headerName: "CreatedOn",
    field: "createdOn",
  },
];
