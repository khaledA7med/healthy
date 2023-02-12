import { IBaseFilters } from "../App/IBaseFilters";

export interface ICustomerServiceFilters extends IBaseFilters
{
    client?: string,
    status?: string,
    type?: string,
    requestNo?: string,
    branch?: string,
    insuranceCompany?: string,
    pendingReason?: string,
    classOfBusniess?: string,
    createdBy?: string,
    duration?: string,
    deadline?: Date,
    chassisNo?: string,
    deadlineFrom?: Date,
    deadlineTo?: Date
}