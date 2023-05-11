import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { ClientsDocumentsListControlsComponent } from "src/app/pages/master-tables/list-of-required-documents/clients-documents/clients-documents-list-controls.component";

export const ClientsListOfDocumentseCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: ClientsDocumentsListControlsComponent,
    pinned: "left",
    maxWidth: 40,
    sortable: false,
  },
  {
    headerName: "No.",
    valueGetter: "node.rowIndex + 1",
    minWidth: 100,
  },
  {
    headerName: "Document Name",
    field: "docName",
  },
];
