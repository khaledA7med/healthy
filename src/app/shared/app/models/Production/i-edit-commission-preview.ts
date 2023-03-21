import { IAddProducersData } from "./i-add-producers";
import { IEditCommissionsFormData } from "./i-edit-commissions-forms";

export interface IEditCommissionsPreview extends IEditCommissionsFormData {
  producersCommissions: IAddProducersData[];
}
