import { ColDef } from "ag-grid-community";
import { ClientCategoriesFormsComponent } from "src/app/pages/master-tables/client-categories/client-categories/client-categories-forms.component";


export const clientCategoriesCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: ClientCategoriesFormsComponent,
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
        headerName: "Client Category",
        field: "category",
    }
];
