import { ClientStatus } from "./../models/Clients/clientUtil";
import { CellEvent } from "ag-grid-community";
import { SalesLeadStatus } from "../models/BusinessDevelopment/business-development-util";
import { IPolicyStatus } from "../models/Production/production-util";
import { claimsStatus } from "../models/Claims/claims-util";
import { CustomerServiceStatusRes } from "../models/CustomerService/icustomer-service-utils";

export default class StatusCellRender {
  public static clientStatus(e: CellEvent): string {
    switch (e.value) {
      case ClientStatus.Prospect:
        return `<span class='badge bg-warning'>${e.value}</span>`;
      case ClientStatus.Active:
        return `<span class='badge bg-success'>${e.value}</span>`;
      case ClientStatus.PendingActivation:
        return `<span class='badge bg-info'>${e.value}</span>`;
      case ClientStatus.Blocked:
        return `<span class='badge bg-dark'>${e.value}</span>`;
      case ClientStatus.Rejected:
        return `<span class='badge bg-danger'>${e.value}</span>`;
      default:
        return `<span class='badge bg-success'>${e.value}</span>`;
    }
  }

  public static salesLeadStatus(e: CellEvent): string {
    switch (e.value) {
      case SalesLeadStatus.Prospect:
        return `<span class='badge text-dark bg-info'>${e.value}</span>`;
      case SalesLeadStatus.Confirmed:
        return `<span class='badge text-dark bg-success'>${e.value}</span>`;
      case SalesLeadStatus.Quoting:
        return `<span class='badge text-dark bg-yellow'>${e.value}</span>`;
      case SalesLeadStatus.PendingwithUnderwriting:
        return `<span class='badge text-dark bg-soft-warning'>${e.value}</span>`;
      case SalesLeadStatus.Lost:
        return `<span class='badge text-dark bg-danger'>${e.value}</span>`;
      case SalesLeadStatus.WaitingForClientFeedback:
        return `<span class='badge text-dark bg-warning'>${e.value}</span>`;
      default:
        return `<span class='badge text-dark bg-success'>${e.value}</span>`;
    }
  }

  public static customerServiceStatus(e: CellEvent): string {
    switch (e.value) {
      case CustomerServiceStatusRes.Pending:
        return `<span class='badge bg-warning text-bg-light' >${e.value}</span>`;
      case CustomerServiceStatusRes.NewRequest:
        return `<span class='badge bg-soft-yellow text-bg-light'>${e.value}</span>`;
      case CustomerServiceStatusRes.Closed:
        return `<span class='badge bg-success text-bg-light'>${e.value}</span>`;
      case CustomerServiceStatusRes.Cancelled:
        return `<span class='badge bg-danger text-bg-light'>${e.value}</span>`;
      default:
        return `<span class='badge bg-dark'>${e.value}</span>`;
    }
  }

  public static policyStatus(e: CellEvent): string {
    switch (e.value) {
      case IPolicyStatus.active:
        return `<span class='badge badge-soft-success'>${e.value}</span>`;
      case IPolicyStatus.pending:
        return `<span class='badge badge-soft-warning'>${e.value}</span>`;
      case IPolicyStatus.expired:
        return `<span class='badge badge-soft-danger'>${e.value}</span>`;
      case IPolicyStatus.approvedByProduction:
        return `<span class='badge badge-soft-info'>${e.value}</span>`;
      case IPolicyStatus.rejectedByProduction:
        return `<span class='badge badge-soft-danger'>${e.value}</span>`;
      case IPolicyStatus.rejectedByFinance:
        return `<span class='badge badge-soft-primary'>${e.value}</span>`;
      default:
        return `<span class='badge badge-soft-info'>${e.value}</span>`;
    }
  }
  public static ClientsPolicyStatus(e: CellEvent): string {
    switch (e.value) {
      case IPolicyStatus.active:
        return `<span class='badge badge-soft-success'>${e.value}</span>`;
      case IPolicyStatus.expired:
        return `<span class='badge badge-soft-danger'>${e.value}</span>`;
      default:
        return `<span class='badge badge-soft-info'>${e.value}</span>`;
    }
  }

  public static systemAdminStatus(e: CellEvent): string {
    switch (e.value) {
      case "Active":
        return `<span class='badge bg-success'>${e.value}</span>`;
      case "Disable":
        return `<span class='badge bg-dark'>${e.value}</span>`;
      default:
        return `<span class='badge bg-danger'>${e.value}</span>`;
    }
  }
  public static claimStatus(e: CellEvent): string {
    switch (e.value) {
      case claimsStatus.active:
        return `<span class='badge bg-success'>${e.value}</span>`;
      case claimsStatus.pending:
        return `<span class='badge bg-warning'>${e.value}</span>`;
      case claimsStatus.closed:
        return `<span class='badge bg-info'>${e.value}</span>`;
      case claimsStatus.rejected:
        return `<span class='badge bg-danger'>${e.value}</span>`;
      default:
        return `<span class='badge bg-black'>${e.value}</span>`;
    }
  }
}
