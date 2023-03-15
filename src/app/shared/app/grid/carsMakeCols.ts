import { CarsMakeFormsComponent } from './../../../pages/master-tables/claims/cars-make/cars-make/cars-make-forms.component';
import { ColDef } from "ag-grid-community";


export const carsMakeCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: CarsMakeFormsComponent,
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
        headerName: "Cars Make",
        field: "carsMake",
    }
];
