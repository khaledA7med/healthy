export interface IChangeStatusRequest {
  clientId: number;
  status: string;
  rejectionReason?: string;
}
