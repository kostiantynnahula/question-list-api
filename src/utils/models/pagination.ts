export type PaginationQuery = {
  take?: number;
  skip?: number;
  order?: 'asc' | 'desc';
  orderBy?: string;
  search?: string;
};
