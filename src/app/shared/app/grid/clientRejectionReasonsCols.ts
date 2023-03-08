import { ColDef } from "ag-grid-community";
import { ClientRejectionReasonsFormsComponent } from "src/app/pages/master-tables/business-development/cancellation-rejection-reasons/client-rejection-reasons/client-rejection-reasons/client-rejection-reasons-forms.component";


export const ClientRejectionReasonsCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: ClientRejectionReasonsFormsComponent,
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
        headerName: "Client Rejection Reason",
        field: "reason",
    }
];
