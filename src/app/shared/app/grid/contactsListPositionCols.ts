import { ColDef } from "ag-grid-community";
import { ContactsListPositionFormsComponent } from "src/app/pages/master-tables/contacts-list-position/contacts-list-position/contacts-list-position-forms.component";

export const contactsListPositionCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: ContactsListPositionFormsComponent,
    pinned: "left",
    maxWidth: 40,
    sortable: false,
  },
  {
    headerName: "No.",
    valueGetter: "node.rowIndex + 1",
    minWidth: 70,
    maxWidth: 300,
  },
  {
    headerName: "position",
    field: "position",
  },
];
