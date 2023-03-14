import { ColDef } from "ag-grid-community";
import { ClaimsStatusFormsComponent } from "src/app/pages/master-tables/claims/claims-status/claims-status/claims-status-forms.component";

export const claimsStatusCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: ClaimsStatusFormsComponent,
        pinned: "left",
        maxWidth: 80,
        sortable: false,
    },
    {
        headerName: "No.",
        field: "sNo",
        minWidth: 70,
    },
    {
        headerName: "Status",
        field: "status",
        minWidth: 320,
    },
    {
        headerName: "Status Notes",
        field: "claimNotes",
        minWidth: 250,
    },
];