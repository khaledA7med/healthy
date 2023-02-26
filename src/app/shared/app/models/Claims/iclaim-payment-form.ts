import { FormControl } from "@angular/forms";

export interface IClaimPayment {
  sNo?: number;
  claimSNo?: number;
  clientName?: string;
  clientNo?: number;
  branch?: string;
  amount?: number;
  paymentDetails?: string;
  paymentType?: string;
  bankName?: string;
  iban?: string;
  dateofCheque?: Date;
  dateofPayment?: Date;

  approved?: boolean;
  approvedBy?: string;
  approvedOn?: Date;
  reject?: boolean;
  savedDate?: Date;
  savedUser?: string;
  status?: string;
  updatedBy?: string;
  updatedOn?: Date;
}

export interface IClaimPaymentForm {
  sNo: FormControl<number | null>;
  claimSNo: FormControl<number | null>;
  paymentType: FormControl<string | null>;
  clientName: FormControl<string | null>;
  clientNo: FormControl<number | null>;
  branch: FormControl<string | null>;
  amount: FormControl<number | null>;
  paymentDetails: FormControl<string | null>;
  bankName: FormControl<string | null>;
  IBAN: FormControl<string | null>;
  dateofCheque: FormControl<Date | null>;
  dateofPayment: FormControl<Date | null>;
}
