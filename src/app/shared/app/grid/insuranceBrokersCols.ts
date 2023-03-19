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
    },
    {
        headerName: "Name",
        field: "companyName",
    },
    {
        headerName: "Tele",
        field: "mobileNo",
    },
    {
        headerName: "Email",
        field: "email",
    },
    {
        headerName: "Address",
        field: "address",
    },
];
