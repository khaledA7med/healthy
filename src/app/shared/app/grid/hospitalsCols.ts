import { HospitalsFormsComponent } from './../../../pages/master-tables/claims/hospitals/hospitals/hospitals-forms.component';
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
        field: "sno",
        minWidth: 70,
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