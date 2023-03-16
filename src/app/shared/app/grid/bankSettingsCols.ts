import { ColDef } from "ag-grid-community";
import { BankSettingsFormsComponent } from "src/app/pages/master-tables/bank-settings/bank-settings/bank-settings-forms.component";


export const bankSettingsCols: ColDef[] = [
    {
        colId: "action",
        cellRenderer: BankSettingsFormsComponent,
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
        headerName: "Bank Name",
        field: "bankName",
    },
    {
        headerName: "Swift",
        field: "swift",
    },
];
