import { PaginationQuery } from 'src/utils/models/pagination';

export type TestPaginationQuery = PaginationQuery & {
  isTemplate?: boolean;
};
