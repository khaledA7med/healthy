import { CellEvent } from "ag-grid-community";

export default class StatusCellRender {
  public static clientStatus(e: CellEvent): string {
    switch (e.value) {
      case "Prospect":
        return `<span class='badge bg-warning'>${e.value}</span>`;
      case "Active":
        return `<span class='badge bg-success'>${e.value}</span>`;
      case "Pending Activation":
        return `<span class='badge bg-info'>${e.value}</span>`;
      case "Blocked":
        return `<span class='badge bg-dark'>${e.value}</span>`;
      case "Rejected":
        return `<span class='badge bg-danger'>${e.value}</span>`;
      default:
        return `<span class='badge bg-success'>${e.value}</span>`;
    }
  }
}
