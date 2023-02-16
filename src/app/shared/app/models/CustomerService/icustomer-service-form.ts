import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { RequiermentsList } from "./icustomer-service-utils";

export interface ICSForm {
	sNo?: FormControl<number | null>;
	branch?: FormControl<string | null>;
	requestNo?: FormControl<string | null>;
	docSNo?: FormControl<number | null>;
	type?: FormControl<string | null>;
	status?: FormControl<string | null>;
	requestStatusNote?: FormControl<string | null>;
	clientID?: FormControl<number | null>;
	clientName?: FormControl<string | null>;
	policyNo?: FormControl<string | null>;
	policySerial?: FormControl<number | null>;
	clientPolicySNo?: FormControl<number | null>;
	endorsType?: FormControl<string | null>;
	insurComp?: FormControl<string | null>;
	classOfBusiness?: FormControl<string | null>;
	lineOfBusiness?: FormControl<string | null>;
	existingPolExpDate?: FormControl<Date | null>;
	cSSpecialConditions?: FormControl<string | null>;
	netPremium?: FormControl<number | null>;
	policyFees?: FormControl<number | null>;
	vatPerc?: FormControl<number | null>;
	vatValue?: FormControl<number | null>;
	totalPremium?: FormControl<number | null>;
	requestDetails?: FormControl<string | null>;
	dateOfDeadline?: FormControl<Date | null>;
	notifyClient?: FormControl<number | null>;
	notifyInsurer?: FormControl<number | null>;
	savedBy?: FormControl<string | null>;
	updatedBy?: FormControl<string | null>;
	clientsDD?: FormControl<string[] | null>;
	endorsementTypeDD?: FormControl<string[] | null>;
	documentsModel?: FormControl<string[] | null>;
	documentLists?: FormControl<string[] | null>;
	endorsements?: FormControl<string | null>;
	isRequierment?: FormControl<boolean | null>;
	pending?: FormControl<boolean | null>;
	pendingNote?: FormControl<string | null>;
	producer?: FormControl<string | null>;
	requiermentsList: FormArray<FormGroup<RequiermentsList>>;
}
