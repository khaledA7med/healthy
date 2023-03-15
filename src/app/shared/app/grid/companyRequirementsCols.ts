import { ColDef } from "ag-grid-community";
import { CustomerServiceRequirementsFormsComponent } from "src/app/pages/master-tables/customer-service/customer-service-requirements/customer-service-requirements/customer-service-requirements-forms.component";


export const CustomerServiceRequirementsCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: CustomerServiceRequirementsFormsComponent,
        pinned: "left",
        maxWidth: 80,
        sortable: false,
    },
    {
        headerName: "No.",
        field: "sno",
    },
    {
        headerName: "item",
        field: "item",
    }
];
