import { ColDef } from "ag-grid-community";
import { InsuranceClassesFormComponent } from "src/app/pages/master-tables/insurance-classes/insurance-classes/insurance-classes-form.component";

export const insuranceClassCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: InsuranceClassesFormComponent,
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
    headerName: "Insurance Class",
    field: "className",
  },
  {
    headerName: "Insurance Class (Ar)",
    field: "classNameAr",
  },
  {
    headerName: "Abbreviation",
    field: "abbreviation",
  },
];
