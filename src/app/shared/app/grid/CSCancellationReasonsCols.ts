import { ColDef } from "ag-grid-community";
import { CancellationReasonsFormsComponent } from "src/app/pages/master-tables/customer-service/cancellation-reasons/cancellation-reasons/cancellation-reasons-forms.component";


export const cancellationReasonsCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: CancellationReasonsFormsComponent,
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
        headerName: "Cancellation Reason",
        field: "cancelReason",
    }
];
