import { IContactListData } from "./i-contact-list";
import { IHospitalsData } from "./i-hospitals";
import { INetworkListData } from "./i-network-list";

export interface IHospitalsPreview extends IHospitalsData {
  contactList: IContactListData[];
  networkList: INetworkListData[];
}
