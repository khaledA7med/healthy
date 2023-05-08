import { ColDef } from "ag-grid-community";
import { PolicyIssuanceRequirementsFormsComponent } from "src/app/pages/master-tables/business-development/sales/policy-issuance-requirements/policy-issuance-requirements/policy-issuance-requirements-forms.component";
import GlobalCellRender from "./globalCellRender";

export const policyIssuanceRequirementsCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: PolicyIssuanceRequirementsFormsComponent,
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
