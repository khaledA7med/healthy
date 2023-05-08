import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { LibrariesFormsListControlsComponent } from "src/app/pages/master-tables/production/libraries-form/libraries-form-list-controls.component";
import GlobalCellRender from "./globalCellRender";

export const masterTableLibrariesCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: LibrariesFormsListControlsComponent,
    pinned: "left",
    maxWidth: 40,
    sortable: false,
  },
  {
    headerName: "No.",
    field: "sNo",
    valueFormatter: (e: ValueFormatterParams) => {
      return (e.node?.rowIndex! + 1).toString();
    },
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
    cellRenderer: GlobalCellRender.NotifyChecker,
  },
];
