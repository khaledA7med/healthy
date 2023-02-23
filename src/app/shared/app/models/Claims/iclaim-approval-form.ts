import { FormControl } from "@angular/forms";

export interface IClaimApproval {
  sNo: number;
  claimSNo: number;
  clientNo: number;
  clientName: string;
  chassisNo: string;
  labor: number;
  towingCharges: number;
  spareParts: number;
  material: number;
  lumpsumAmount: number;
  totalAmount: number;
  deductibleExcess: number;
  depreciation: number;
  netAmount: number;
  totalLoss: number;
  VATAmount: number;
  discounts: number;
  approvalDate: Date;
}

export interface IClaimApprovalForm {
  sNo: FormControl<number | null>;
  claimSNo: FormControl<number | null>;
  clientNo: FormControl<number | null>;
  clientName: FormControl<string | null>;
  chassisNo: FormControl<string | null>;
  labor: FormControl<number | null>;
  towingCharges: FormControl<number | null>;
  spareParts: FormControl<number | null>;
  material: FormControl<number | null>;
  lumpsumAmount: FormControl<number | null>;
  totalAmount: FormControl<number | null>;
  deductibleExcess: FormControl<number | null>;
  depreciation: FormControl<number | null>;
  netAmount: FormControl<number | null>;
  totalLoss: FormControl<number | null>;
  VATAmount: FormControl<number | null>;
  discounts: FormControl<number | null>;
  approvalDate: FormControl<Date | null>;
}
