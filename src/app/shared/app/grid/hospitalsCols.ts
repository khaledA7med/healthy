import { HospitalsFormsComponent } from "./../../../pages/master-tables/claims/hospitals/hospitals/hospitals-forms.component";
import { ColDef } from "ag-grid-community";

export const hospitalsCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: HospitalsFormsComponent,
    pinned: "left",
    maxWidth: 80,
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
    minWidth: 320,
  },
  {
    headerName: "City",
    field: "city",
    minWidth: 250,
  },
  {
    headerName: "Address",
    field: "address",
    minWidth: 150,
  },
  {
    headerName: "Email",
    field: "email",
    minWidth: 150,
  },
  {
    headerName: "Tele",
    field: "tele",
    minWidth: 150,
  },
  {
    headerName: "Specialties",
    field: "specialties",
  },
];
