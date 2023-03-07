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
