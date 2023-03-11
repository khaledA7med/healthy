import { ColDef } from "ag-grid-community";
import { NationalitiesFormsComponent } from "src/app/pages/master-tables/nationalities/nationalities/nationalities-forms.component";


export const nationalitiesCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: NationalitiesFormsComponent,
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
        headerName: "Nationality",
        field: "nationality",
    }
];