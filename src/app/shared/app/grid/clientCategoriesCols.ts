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
    valueGetter: "node.rowIndex + 1",
    minWidth: 70,
    maxWidth: 300,
  },
  {
    headerName: "Client Category",
    field: "category",
  },
];
