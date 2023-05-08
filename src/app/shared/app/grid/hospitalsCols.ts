import { HospitalsFormsComponent } from "./../../../pages/master-tables/claims/hospitals/hospitals/hospitals-forms.component";
import { ColDef } from "ag-grid-community";

export const hospitalsCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: HospitalsFormsComponent,
    pinned: "left",
    maxWidth: 40,
    sortable: false,
  },
  {
    headerName: "No.",
    valueGetter: "node.rowIndex + 1",
    minWidth: 70,
    maxWidth: 300,
  },
  {
    headerName: "Name",
    field: "name",
    minWidth: 230,
  },
  {
    headerName: "City",
    field: "city",
  },
  {
    headerName: "Address",
    field: "address",
  },
  {
    headerName: "Email",
    field: "email",
  },
  {
    headerName: "Tele",
    field: "tele",
  },
  {
    headerName: "Specialties",
    field: "specialties",
  },
];
