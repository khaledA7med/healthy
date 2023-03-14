import { ColDef } from "ag-grid-community";
import { ClaimsGeneralItemsFormsComponent } from "src/app/pages/master-tables/claims/claims-general-items/claims-general-items/claims-general-items-forms.component";

export const claimsGeneralItemsCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: ClaimsGeneralItemsFormsComponent,
        pinned: "left",
        maxWidth: 80,
        sortable: false,
    },
    {
        headerName: "No.",
        field: "SNo",
        minWidth: 70,
    },
    {
        headerName: "Item",
        field: "item",
        minWidth: 320,
    },
    {
        headerName: "Default",
        field: "mandatory",
        minWidth: 250,
    },
];