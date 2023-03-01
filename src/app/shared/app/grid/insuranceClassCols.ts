import { ColDef } from "ag-grid-community";
import { InsuranceClassesFormComponent } from "src/app/pages/master-tables/insurance-classes/insurance-classes/insurance-classes-form.component";

export const insuranceClassCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: InsuranceClassesFormComponent,
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
        headerName: "Class of Insurance",
        field: "className",
    },
    {
        headerName: "Class of Insurance(Ar)",
        field: "classNameAr",
        minWidth: 250,
    },
    {
        headerName: "Abbreviation",
        field: "abbreviation",
        minWidth: 120,
    }
];
