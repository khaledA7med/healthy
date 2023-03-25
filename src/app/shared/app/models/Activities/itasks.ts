export interface ITasks {
  sNo?: number;
  assignedBy?: string;
  assignedOn?: string;
  assignedTo?: string;
  claimNo?: string;
  clientID?: number;
  clientName?: string;
  closedBy?: string;
  closedOn?: Date;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  isAllDay?: boolean;
  leadNo?: string;
  leadProducer?: string;
  module?: string;
  moduleSNo?: number;
  moduleNO?: string;
  policyNo?: string;
  requestNo?: string;
  status?: string;
  taskClosingNotes?: string;
  taskDetails?: string;
  taskName?: string;
  timeStampFrom?: number;
  timeStampTo?: number;
  type?: string;
}
