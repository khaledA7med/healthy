import { ColDef } from "ag-grid-community";
import { InsuranceBrokersFormsComponent } from "src/app/pages/master-tables/insurance-brokers/insurance-brokers/insurance-brokers-forms.component";

export const insuranceBrokersCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: InsuranceBrokersFormsComponent,
        pinned: "left",
        maxWidth: 80,
        sortable: false,
    },
    {
        headerName: "No.",
        field: "sno",
        minWidth: 100,
    },
    {
        headerName: "Name",
        field: "companyName",
        minWidth: 250,
    },
    {
        headerName: "Tele",
        field: "mobileNo",
        minWidth: 250,
    },
    {
        headerName: "Email",
        field: "email",
        minWidth: 120,
    },
    {
        headerName: "Address",
        field: "address",
        minWidth: 120,
    },
];
