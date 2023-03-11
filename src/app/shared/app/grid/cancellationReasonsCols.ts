import { ColDef } from "ag-grid-community";
import { CancellationReasonsFormsComponent } from "src/app/pages/master-tables/business-development/cancellation-rejection-reasons/cancellation-reasonssons/cancellation-reasons/cancellation-reasons-forms.component";


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
        field: "sNo",
        minWidth: 100,
    },
    {
        headerName: "Cancellation Reason",
        field: "reason",
    }
];
