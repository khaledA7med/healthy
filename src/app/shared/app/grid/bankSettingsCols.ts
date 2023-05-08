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
    valueGetter: "node.rowIndex + 1",
    minWidth: 70,
    maxWidth: 300,
  },
  {
    headerName: "Bank Name",
    field: "bankName",
    minWidth: 140,
    maxWidth: 500,
  },
  {
    headerName: "Swift",
    field: "swift",
  },
];
