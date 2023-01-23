export const ApiRoutes = {
	Users: {
		login: "/Account/login",
	},
	Clients: {
		search: "/ClientRegistry/Client/Search",
	},
	ClientsGroups: {
		list: "/ClientRegistry/Groups/Search",
		create: "/ClientRegistry/Groups/Create",
		delete: "/ClientRegistry/Groups/Delete",
		listGroupClients: "/ClientRegistry/Groups/AllClients",
		addGroupClient: "/ClientRegistry/Groups/Join",
		deleteGroupClient: "/ClientRegistry/Groups/RemoveClient",
	},
};
