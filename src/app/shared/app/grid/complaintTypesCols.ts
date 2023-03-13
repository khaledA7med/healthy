import { ComplaintsTypesFormsComponent } from './../../../pages/master-tables/customer-service/complaints-types/complaints-types/complaints-types-forms.component';
import { ColDef } from "ag-grid-community";

export const complaintsTypesCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: ComplaintsTypesFormsComponent,
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
        headerName: "Complaint Type",
        field: "type",
    }
];
