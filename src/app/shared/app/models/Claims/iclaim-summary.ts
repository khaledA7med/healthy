export interface IClaimSummary {
	activeRequestsByClients?: IActiveRequestsByClient[];
	activeRequestsGropedByIcs?: IActiveRequestsGropedByIcs[];
}

export interface IActiveRequestsByClient {
	clientID?: number;
	clientName?: string;
	noOfRequests?: number;
	claimType?: string[];
}

export interface IActiveRequestsGropedByIcs {
	insuranceCompany?: string;
	noOfRequests?: number;
}

export interface IActiveClientWithInsuranceClaim extends IActiveRequestsByClient, IActiveRequestsGropedByIcs {}
