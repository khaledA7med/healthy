import { ColDef } from "ag-grid-community";
import { ClaimsGeneralItemsFormsComponent } from "src/app/pages/master-tables/claims/claims-general-items/claims-general-items/claims-general-items-forms.component";
import GlobalCellRender from "./globalCellRender";

export const claimsGeneralItemsCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: ClaimsGeneralItemsFormsComponent,
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
    headerName: "Item",
    field: "item",
  },
  {
    headerName: "Default",
    field: "mandatory",
    cellRenderer: GlobalCellRender.NotifyChecker,
  },
];
