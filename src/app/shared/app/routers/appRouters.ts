export const AppRoutes = {
  Auth: {
    login: "login",
  },
  grid: {
    index: "igrid",
  },
  Error: {
    base: "pages",
    comingSoon: "pages/coming-soon",
    notFound: "pages/not-found",
  },
  MasterTable: {
    insuranceClasses: "insurance-classes",
    lineOfBusiness: "line-of-business",
    insuranceCompanies: "insurance-companies",
    insuranceBrokers: "insurance-brokers",
    policyTypes: "policy-types",
    nationalities: "nationalities",
    businessActivity: "business-activity",
    legalStatus: "legal-status",
    locations: "locations",
    businessDevelopment: {
      Sales: {
        QuotingRequirements: "quoting-requirements",
        PolicyIssuanceRequirements: "policy-issuance-requirements",
        ProspectLossReasons: "prospect-loss-reasons"
      },
      CancellationRejectionReasons: {
        CompanyRejectionReasons: "company-rejection-reasons",
        ClientRejectionReasons: "client-rejection-reasons",
        CancellationReasons: "cancellation-reasons"
      }
    },
    clientCategories: "client-categories",
    customerService: {
      insuranceCompaniesDocuments: " insurance-companies-documents",
      customerServiceRequirements: "customer-service-requirements",
      complaintsTypes: "complaints-types",
      complaintsSettings: "complaints-settings",
      complaintsSuspectiveCauses: "complaints-suspective-causes",
      cancellationReason: "cancellation-reasons",
    }
  },
  Client: {
    base: "clients",
    clientRegistry: "clients",
    clientForms: "clients/create",
    clientEdit: "clients/update/",
    groups: "clients/groups",
    reports: "clients/reports",
  },
  BusinessDevelopment: {
    base: "saleslead",
    management: "saleslead",
    dashboard: "saleslead/dashboard",
    create: "saleslead/create",
    edit: "saleslead/update/",
    reports: {
      business: "saleslead/business-report",
      renewal: "saleslead/renewal-report",
    },
  },
  Production: {
    base: "production",
    details: "policy",
    create: "production/create",
    edit: "production/update/",
    editCommissions: "production/edit-commissions",
    makeInvoice: "production/invoice/",
    reports: {
      production: "production/production-report",
      renewal: "production/renewal-report",
      renewalsNotice: "production/renewal-notice-report",
    },
  },
  CustomerService: {
    base: "customer-service",
    create: "customer-service/create",
    edit: "customer-service/update/",
    reports: "customer-service/reports",
  },
  Claims: {
    base: "claims",
    create: "claims/create",
    edit: "claims/update/",
    reports: "claims/reports",
  },
  SystemAdmin: {
    base: "system-admin",
    create: "system-admin/create",
    privileges: "system-admin/privileges",
  },
  Email: {
    base: "emails",
  },
};
