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
    list: "/ClientRegistry/Groups/Search",
    create: "/ClientRegistry/Groups/Create",
    delete: "/ClientRegistry/Groups/Delete",
    listGroupClients: "/ClientRegistry/Groups/AllClients",
    addGroupClient: "/ClientRegistry/Groups/Join",
    deleteGroupClient: "/ClientRegistry/Groups/RemoveClient",
  },
};
