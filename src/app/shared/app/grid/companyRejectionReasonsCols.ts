import { ColDef } from "ag-grid-community";
import { CompanyRejectionReasonsFormsComponent } from "src/app/pages/master-tables/business-development/cancellation-rejection-reasons/company-rejection-reasons/company-rejection-reasons/company-rejection-reasons-forms.component";

export const companyRejectionReasonsCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: CompanyRejectionReasonsFormsComponent,
    pinned: "left",
    maxWidth: 80,
    sortable: false,
  },
  {
    headerName: "No.",
    valueGetter: "node.rowIndex + 1",
  },
  {
    headerName: "Company Rejection Reason",
    field: "reason",
  },
];
