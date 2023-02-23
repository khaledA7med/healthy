import { IBaseFilters } from "../App/IBaseFilters";

export interface IEditCommissionsFilter extends IBaseFilters
{
    clientName?: string,
    policyNumber?: string,
    producer?: string
}