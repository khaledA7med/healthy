import { ColDef } from "ag-grid-community";
import { InsuranceCompaniesDocumentsFormsComponent } from "src/app/pages/master-tables/customer-service/insurance-companies-documents/insurance-companies-documents/insurance-companies-documents-forms.component";


export const InsuranceCompaniesDocumentsCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: InsuranceCompaniesDocumentsFormsComponent,
        pinned: "left",
        maxWidth: 80,
        sortable: false,
    },
    {
        headerName: "File Name",
        field: "name",
    }
];