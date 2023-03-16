import { ColDef } from "ag-grid-community";
import { CitiesFormsComponent } from "src/app/pages/master-tables/cities/cities/cities-forms.component";


export const citiesCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: CitiesFormsComponent,
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
        headerName: "City Name",
        field: "city",
    }
];
