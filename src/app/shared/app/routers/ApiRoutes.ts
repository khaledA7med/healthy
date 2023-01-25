export const ApiRoutes = {
  Users: {
    login: "/Account/login",
  },
  Clients: {
    search: "/ClientRegistry/Clients/Search",
  },
  ClientsGroups: {
    list: "/ClientRegistry/Groups/Search",
    create: "/v1/ClientRegistry/Groups/Create",
    delete: "/v1/ClientRegistry/Groups/Delete",
    listGroupClients: "/ClientRegistry/Groups/AllClients",
    addGroupClient: "/v1/ClientRegistry/Groups/Join",
    deleteGroupClient: "/v1/ClientRegistry/Groups/RemoveClient",
  },
};
