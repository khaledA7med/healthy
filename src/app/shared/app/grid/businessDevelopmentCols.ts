import { ColDef } from "ag-grid-community";
import { BusinessDevelopmentControlsComponent } from "src/app/pages/business-development/business-development-management/business-development-controls.component";
import GlobalCellRender from "./globalCellRender";
import StatusCellRender from "./statusCellRender";

export const businessDevelopmentCols: ColDef[] = [
  {
    colId: "action",
    cellRenderer: BusinessDevelopmentControlsComponent,
    pinned: "left",
    maxWidth: 40,
    sortable: false,
  },
  {
    headerName: "Status",
    cellRenderer: StatusCellRender.salesLeadStatus,
    field: "status",
    minWidth: 200,
  },
  {
    headerName: "Lead Type",
    field: "leadType",
    sort: "asc",
    minWidth: 130,
  },
  {
    headerName: "Lead No.",
    field: "leadNo",
    minWidth: 200,
  },
  {
    headerName: "Client ID",
    field: "clientID",
  },
  {
    headerName: "Client Name",
    field: "name",
    minWidth: 250,
  },
  {
    headerName: "Producer",
    field: "producer",
    minWidth: 250,
  },
  {
    headerName: "Class of Business",
    field: "classOfBusiness",
    minWidth: 250,
  },
  {
    headerName: "Line of Business",
    field: "lineOfBusiness",
    minWidth: 250,
  },
  {
    headerName: "Deadline",
    field: "deadline",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 150,
  },
  {
    headerName: "Current Insurer",
    field: "currentInsurer",
    minWidth: 250,
  },
  {
    headerName: "Expiry Date",
    field: "existingPolExpDate",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 150,
  },
  {
    headerName: "Quoted Date",
    field: "quoatationDate",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 150,
  },
  {
    headerName: "Quoted Premium",
    field: "quoatedPremium",
  },
  {
    headerName: "Revised Quotation Date",
    field: "revisedQuoatationDate",
    valueFormatter: GlobalCellRender.dateFormater,
  },
  {
    headerName: "Revised Quotation Premium",
    field: "revisedQuoatationPremium",
  },
  {
    headerName: "Client Result",
    field: "clientResult",
  },
  {
    headerName: "Client Result Date",
    field: "clientResultDate",
    valueFormatter: GlobalCellRender.dateFormater,
  },
  {
    headerName: "Client Result Premium",
    field: "clientResultPremium",
  },
  {
    headerName: "Reason",
    field: "reason",
  },
  {
    headerName: "Created By",
    field: "savedBy",
    minWidth: 200,
  },
  {
    headerName: "Created On",
    field: "savedDate",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 150,
  },
  {
    headerName: "Updated By",
    field: "updatedBy",
    minWidth: 200,
  },
  {
    headerName: "Updated On",
    field: "updatedOn",
    valueFormatter: GlobalCellRender.dateFormater,
    minWidth: 150,
  },
];
