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
    insuranceClasses: "/master/insurance-classes",
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
    create: "saleslead/create",
    edit: "saleslead/update/",
    Reports: {
      Business: "saleslead/business-report",
      Renewal: "saleslead/renewal-report",
    },
  },
  Production: {
    base: "production",
    details: "policy",
    create: "production/create",
    edit: "production/update/",
  },
  CustomerService: {
    base: "customer-service",
    create: "customer-service/create",
    edit: "customer-service/update/",
  },
  Claims: {
    base: "claims",
    create: "claims/create",
    edit: "claims/update/",
  },
};
