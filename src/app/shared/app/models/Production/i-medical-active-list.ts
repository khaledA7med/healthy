export interface IMedicalActive {
  sNo?: number;
  policiesSNo?: number;
  status?: string;
  oasisPolRef?: string;
  clientNo?: number;
  clientName?: string;
  producer?: string;
  insurComp?: string;
  className?: string;
  lineOfBusiness?: string;
  issueDate?: Date;
  periodFrom?: Date;
  periodTo?: Date;
  producerCommPerc?: number;
  compCommPerc?: number;
  cancelled?: number;
  savedBy?: number;
  savedOn?: Date;
  identity?: string;
}

export interface IMedicalActivePreview {
  sNo?: number;
  oasisPolRef?: string;
  reversalOf?: string;
  policiesSNo?: number;
  clientNo?: number;
  clientName?: string;
  producer?: string;
  accNo?: string;
  policyNo?: string;
  insurComp?: string;
  className?: string;
  lineOfBusiness?: string;
  issueDate?: Date;
  periodFrom?: Date;
  periodTo?: Date;
  paymentType?: string;
  compCommPerc?: number;
  producerCommPerc?: number;
  savedBy?: number;
  savedOn?: Date;
  updatedBy?: number;
  updatedOn?: Date;
  cancelledUser?: string;
  cancelledDate?: Date;
  cancelled?: number;
  identity?: string;
}
