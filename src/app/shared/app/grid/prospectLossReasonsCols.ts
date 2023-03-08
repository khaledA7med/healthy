import { ColDef } from "ag-grid-community";
import { ProspectLossReasonsFormsComponent } from "src/app/pages/master-tables/business-development/sales/prospect-loss-reasons/prospect-loss-reasons/prospect-loss-reasons-forms.component";


export const prospectLossReasonsCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: ProspectLossReasonsFormsComponent,
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
        headerName: "Loss Reason",
        field: "reason",
    }
];
