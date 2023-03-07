import { ColDef } from "ag-grid-community";
import { LocationsFormsComponent } from "src/app/pages/master-tables/locations/locations/locations-forms.component";


export const locationsCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: LocationsFormsComponent,
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
        headerName: "Location Name",
        field: "locationName",
    }
];
