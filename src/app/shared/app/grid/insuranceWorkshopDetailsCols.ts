import { ColDef } from "ag-grid-community";
import { InsuranceWorkshopDetailsFormsComponent } from 'src/app/pages/master-tables/claims/insurance-work-shop-details/insurance-workshop-details/insurance-workshop-details-forms.component';

export const insuranceWorkshopDetailsCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: InsuranceWorkshopDetailsFormsComponent,
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
        headerName: "Insurance Company Name",
        field: "insuranceCompany",
        minWidth: 320,
    },
    {
        headerName: "Workshop Name",
        field: "workshopName",
        minWidth: 250,
    },
    {
        headerName: "City",
        field: "city",
        minWidth: 150,
    },
    {
        headerName: "Address",
        field: "address",
        minWidth: 150,
    },
    {
        headerName: "Tele",
        field: "telephone",
        minWidth: 150,
    },
    {
        headerName: "Email",
        field: "email",
    },
];