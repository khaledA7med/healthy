export const ApiRoutes = {
  Users: {
    login: "/Account/login",
  },
  Clients: {
    search: "/ClientRegistry/Clients/Search",
    details: "/ClientRegistry/Clients/Details",
    changeStatus: "/ClientRegistry/Clients/ChangeStatus",
  },
  ClientsGroups: {
    list: "/v1/ClientRegistry/Groups/Search",
    create: "/v1/ClientRegistry/Groups/Create",
    delete: "/v1/ClientRegistry/Groups/Delete",
    listGroupClients: "/v1/ClientRegistry/Groups/AllClients",
    addGroupClient: "/v1/ClientRegistry/Groups/Join",
    deleteGroupClient: "/v1/ClientRegistry/Groups/RemoveClient",
  },
};
