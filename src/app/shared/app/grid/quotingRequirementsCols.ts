import { ColDef } from "ag-grid-community";
import { QuotingRequirementsFormsComponent } from "src/app/pages/master-tables/business-development/sales/quoting-requirements/quoting-requirements/quoting-requirements-forms.component";

export const quotingRequirementsCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: QuotingRequirementsFormsComponent,
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
        headerName: "Item",
        field: "item",
    },
    {
        headerName: "Item (Ar)",
        field: "itemArabic",
    },
    {
        headerName: "Description",
        field: "description",
        minWidth: 250,
    },
    {
        headerName: "Description (Ar)",
        field: "descriptionArabic",
        minWidth: 120,
    },
    {
        headerName: "Default",
        field: "defaultTick",
        minWidth: 120,
    }
];
