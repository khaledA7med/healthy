import { ColDef } from "ag-grid-community";
import { HospitalsListControlsComponent } from "src/app/pages/master-tables/claims/hospitals/hospitals/hospitals-list-controls.component";

export const hospitalsCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: HospitalsListControlsComponent,
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
