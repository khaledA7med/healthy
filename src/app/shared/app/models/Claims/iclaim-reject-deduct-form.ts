import { FormControl } from "@angular/forms";

export interface IClaimRejectDeduct {
  sNo?: number;
  claimSNo?: number;
  clientNo?: number;
  clientName?: string;
  type?: string;
  amount?: number;
  rejectionReason?: string;
  rejectionNote?: string;
}

export interface IClaimRejectDeductForm {
  sNo?: FormControl<number | null>;
  claimSNo?: FormControl<number | null>;
  clientNo?: FormControl<number | null>;
  clientName?: FormControl<string | null>;
  type?: FormControl<string | null>;
  amount?: FormControl<number | null>;
  rejectionReason?: FormControl<string | null>;
  rejectionNote?: FormControl<string | null>;
}

export enum RejectDeduct {
  Rejected = "Rejected",
  Deducted = "Deducted",
}
