import { ColDef } from "ag-grid-community";
import { InsuranceCompaniesFormsComponent } from "src/app/pages/master-tables/insurance-companies/insurance-companies/insurance-companies-forms.component";
InsuranceCompaniesFormsComponent
export const insuranceCompaniesCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: InsuranceCompaniesFormsComponent,
        pinned: "left",
        maxWidth: 80,
        sortable: false,
    },
    {
        headerName: "No.",
        field: "sNo",
        minWidth: 100,
    },
    {
        headerName: "Company Name",
        field: "companyName",
    },
    {
        headerName: "Company Name(Ar)",
        field: "companyNameAr",
        minWidth: 250,
    },
    {
        headerName: "VAT No.",
        field: "vatNo",
        minWidth: 250,
    },
    {
        headerName: "CR No.",
        field: "crNo",
        minWidth: 250,
    },
    {
        headerName: "Unified No.",
        field: "unifiedNo",
        minWidth: 250,
    },
    {
        headerName: "Tel",
        field: "tele1",
        minWidth: 250,
    },
    {
        headerName: "Email",
        field: "email",
        minWidth: 250,
    },
    {
        headerName: "Address",
        field: "address",
        minWidth: 450,
    },
    {
        headerName: "Abbreviation",
        field: "abbreviation",
        minWidth: 120,
    }
];