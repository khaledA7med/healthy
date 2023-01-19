export interface IClient {
  sNo?: number;
  status?: string;
  fullName?: string;
  fullNameAr?: string;
  accNoONB?: string;
  accNoOFB?: string;
  type?: string;
  branch?: string;
  producer?: string;
  accountManager?: string;
  commericalNo?: string;
  accountGroup?: string;
  createdBy?: string;
  createdOn?: Date;
  rejectionReason?: string;
  rejectedBy?: string;
  rejectionDate?: Date;
  approvedBy?: string;
  approvedDate?: Date;
}
