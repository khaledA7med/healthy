export interface IBusinessDevelopment {
  sNo?: number;
  status?: string;
  leadType?: string;
  leadNo?: string;
  clientID?: number;
  name?: string;
  producer?: string;
  classOfBusiness?: string;
  lineOfBusiness?: string;
  deadline?: Date;
  chCurrentInsurer?: boolean;
  currentInsurer?: string;
  existingPolExpDate?: Date;
  quoatationDate?: Date;
  quoatedPremium?: number;
  revisedQuoatationDate?: Date;
  revisedQuoatationPremium?: number;
  clientResult?: string;
  clientResultDate?: Date;
  clientResultPremium?: number;
  reason?: string;
  savedBy?: string;
  savedDate?: Date;
  updatedBy?: string;
  updatedOn?: Date;
}
