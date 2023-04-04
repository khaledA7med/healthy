import { MedicalActiveListControlsComponent } from "./../../../pages/production/medical-active-list/medical-active-list/medical-active-list-controls.component";
import { ColDef } from "ag-grid-community";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";

export const medicalActiveListCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: MedicalActiveListControlsComponent,
    pinned: "left",
    maxWidth: 80,
    sortable: false,
  },
  {
    headerName: "",
    field: "",
    minWidth: 150,
    cellRenderer: StatusCellRender.policyStatus,
  },
  {
    headerName: "",
    field: "",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 120,
  },
];
