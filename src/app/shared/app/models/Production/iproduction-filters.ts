import { IBaseFilters } from "../App/IBaseFilters";

export interface IProductionFilters extends IBaseFilters {
	status?: string[];
	leadType?: string;
	name?: string;
	producer?: string;
	classOfBusiness?: string;
	lineOfBusiness?: string;
	deadline?: Date;
	savedBy?: string;
	updatedBy?: string;
	savedDate?: Date;
	updatedOn?: Date;
}
