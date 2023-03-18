import { ColDef } from "ag-grid-community";
import { ContactsListPositionFormsComponent } from "src/app/pages/master-tables/contacts-list-position/contacts-list-position/contacts-list-position-forms.component";


export const contactsListPositionCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: ContactsListPositionFormsComponent,
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
        headerName: "position",
        field: "position",
    }
];
