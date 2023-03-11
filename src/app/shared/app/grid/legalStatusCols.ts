import { ColDef } from "ag-grid-community";
import { LegalStatusFormsComponent } from "src/app/pages/master-tables/legal-status/legal-status/legal-status-forms.component";


export const legalStatusCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: LegalStatusFormsComponent,
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
        headerName: "Legal Status",
        field: "legalStatus",
    }
];
