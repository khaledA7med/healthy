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
  },
  MasterTable: {
    insuranceClasses: "/Master/InsuranceClasses",
  },
  Client: {
    base: "Clients",
    clientRegistry: "Clients",
    clientForms: "Clients/Create",
    clientEdit: "Clients/Update/:id",
    groups: "Clients/Groups",
    reports: "Clients/Reports",
  },
  BusinessDevelopment: {
    Management: "SalesLead/Management",
    Reports: {
      Business: "SalesLead/BusinessReport",
      Renewal: "SalesLead/RenewalReport",
    },
  },
};
