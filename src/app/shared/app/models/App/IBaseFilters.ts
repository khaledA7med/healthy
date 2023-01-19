export interface IBaseFilters {
  pageNumber: number;
  pageSize: number;
  orderDir: "asc" | "desc";
  orderBy: string;
}
