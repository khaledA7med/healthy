import { FormControl } from "@angular/forms";

export interface IClaimInvoice {
  sNo?: number;
  claimSNo?: number;
  clientNo?: number;
  clientName?: string;
  invoiceNo?: string;
  invoiceDate?: Date;
  WIPNo?: string;
  chassisNo?: string;
  labor?: number;
  towingCharges?: number;
  spareParts?: number;
  others?: number;
  estimatedCharges?: number;
  grandTotal?: number;
  deductibleExcess?: number;
  discount?: number;
  VATInvoicesAmount?: number;
  amountDue?: number;
  savedUser?: string;
  savedDate?: Date;
  updatedBy?: string;
  updatedOn?: Date;
}

export interface IClaimInvoiceForm {
  sNo?: FormControl<number | null>;
  claimSNo?: FormControl<number | null>;
  clientNo?: FormControl<number | null>;
  clientName?: FormControl<string | null>;
  invoiceNo?: FormControl<string | null>;
  invoiceDate?: FormControl<Date | null>;
  WIPNo?: FormControl<string | null>;
  chassisNo?: FormControl<string | null>;
  labor?: FormControl<number | null>;
  towingCharges?: FormControl<number | null>;
  spareParts?: FormControl<number | null>;
  others?: FormControl<number | null>;
  estimatedCharges?: FormControl<number | null>;
  grandTotal?: FormControl<number | null>;
  deductibleExcess?: FormControl<number | null>;
  discount?: FormControl<number | null>;
  VATInvoicesAmount?: FormControl<number | null>;
  amountDue?: FormControl<number | null>;
  savedUser?: FormControl<string | null>;
  savedDate?: FormControl<Date | null>;
  updatedBy?: FormControl<string | null>;
  updatedOn?: FormControl<Date | null>;
}
