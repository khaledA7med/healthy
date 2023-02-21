import { IBaseFilters } from "../App/IBaseFilters";

export interface ISystemAdminFilters extends IBaseFilters
{
    fullName: string,
    branch: string,
    jobTitle: string,
    status: string
}