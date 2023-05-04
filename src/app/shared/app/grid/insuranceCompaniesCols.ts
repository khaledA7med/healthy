import { ColDef } from "ag-grid-community";
import { InsuranceCompaniesFormsComponent } from "src/app/pages/master-tables/insurance-companies/insurance-companies/insurance-companies-forms.component";

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
    valueGetter: "node.rowIndex + 1",
    minWidth: 70,
    maxWidth: 300,
  },
  {
    headerName: "Company Name",
    field: "companyName",
    minWidth: 320,
  },
  {
    headerName: "Company Name(Ar)",
    field: "companyNameAr",
    minWidth: 250,
  },
  {
    headerName: "VAT No.",
    field: "vatNo",
    minWidth: 150,
  },
  {
    headerName: "CR No.",
    field: "crNo",
    minWidth: 150,
  },
  {
    headerName: "Unified No.",
    field: "unifiedNo",
    minWidth: 130,
  },
  {
    headerName: "Tel",
    field: "tele1",
  },
  {
    headerName: "Email",
    field: "email",
  },
  {
    headerName: "Address",
    field: "address",
    minWidth: 600,
  },
  {
    headerName: "Abbreviation",
    field: "abbreviation",
    minWidth: 120,
  },
];
