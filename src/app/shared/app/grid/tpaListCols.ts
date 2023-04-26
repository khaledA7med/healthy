import { TpaListFormsComponent } from "./../../../pages/master-tables/claims/tpa-list/tpa-list/tpa-list-forms.component";
import { ColDef } from "ag-grid-community";

export const tpaListCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: TpaListFormsComponent,
    pinned: "left",
    maxWidth: 80,
    sortable: false,
  },
  {
    headerName: "No.",
    valueGetter: "node.rowIndex + 1",
  },
  {
    headerName: "TPA Name",
    field: "tpaName",
  },
];
