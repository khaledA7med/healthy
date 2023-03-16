import { ColDef } from "ag-grid-community";
import { VehiclesTypesFormsComponent } from "src/app/pages/master-tables/vehicles-types/vehicles-types/vehicles-types-forms.component";


export const vehiclesTypesCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: VehiclesTypesFormsComponent,
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
        headerName: "Vehicle Type",
        field: "vehicleType",
    },
    {
        headerName: "Abbreviation Type",
        field: "abbreviation",
    },
];
