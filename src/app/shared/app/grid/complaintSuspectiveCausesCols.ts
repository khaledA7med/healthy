import { ComplaintsSuspectiveCausesFormsComponent } from './../../../pages/master-tables/customer-service/complaints-suspective-causes/complaints-suspective-causes/complaints-suspective-causes-forms.component';
import { ColDef } from "ag-grid-community";

export const complaintsSuspectiveCausesCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: ComplaintsSuspectiveCausesFormsComponent,
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
        headerName: "Suspective Cause",
        field: "suspectiveCause",
    }
];