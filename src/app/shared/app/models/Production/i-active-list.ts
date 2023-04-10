export interface IActiveList {
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
