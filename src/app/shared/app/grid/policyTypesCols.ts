import { ColDef } from "ag-grid-community";
import { PolicyTypesFromsComponent } from "src/app/pages/master-tables/policy-types/policy-types/policy-types-froms.component";


export const policyTypesCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: PolicyTypesFromsComponent,
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
        headerName: "Policy Type",
        field: "policyType",
    }
];
