import { IContactListData } from "./i-contact-list";
import { IInsuranceCompaniesData } from "./i-insurance-companies";
import { IProductsListData } from "./i-products-list";

export interface IInsuranceCompaniesPreview extends IInsuranceCompaniesData {
  contactList: IContactListData[];
  productsList: IProductsListData[];
}
