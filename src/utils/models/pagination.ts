export type PaginationQuery = {
  take?: number;
  skip?: number;
  order?: 'asc' | 'desc';
  orderBy?: string;
  search?: string;
};

export type PaginationResponse<T> = {
  list: T[];
  total: number;
};
