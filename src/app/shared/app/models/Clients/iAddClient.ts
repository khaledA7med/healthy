export interface iAddClient {
    ClientDetails: ClientDetails,
    ClientContact: ClientContact,
    ClientsBankAccount: ClientsBankAccount
 }
export interface ClientDetails {
    policyType: string,
    fullName: string,
    fullNameAr: string,
    producer: string,
    relationshipStatus: string,
    businessType: string,
    channel: string,
    interface: string,
    screeningResult: string,
    officalName: string,
    type: string,
}

export interface ClientContact {
    sNo: number,
    branch: string,
    clientID: number,
    contactName: string,
    mobile: string,
    lineOfBusiness: string,
    department: string,
    extension: string,
    position: string,
    mainContact: number,
    tele: string,
    email: string,
    dateofBirth: string,
    savedUser: string,
    address: string
}

export interface ClientsBankAccount {
    sNo: number,
    clientID: number,
    bankName: string,
    branch: string,
    iban: string,
    swiftCode: string,
    fullName: string,
    arabicName: string,
    stauts: string,
}
      
