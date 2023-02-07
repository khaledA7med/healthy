import { IBaseFilters } from "../App/IBaseFilters";

export interface ICustomerServiceFilters extends IBaseFilters
{
    topStatusCount?: number,
    client?: string,
    status?: string[],
    type?: string[],
    requestNo?: string,
    branch?: string,
    insuranceCompany?: string,
    pendingReason?: string,
    chassisNo?: string,
    classOfBusniess?: string,
    createdBy?: string,
    duration?: string,
    deadline?: string,
    deadlineFrom?: string,
    deadlineTo?: string
}