export const SORT_DIRECTIONS = ['asc', 'desc'] as const;

export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export type PaginationQuery<TSortBy extends string = string> = {
  page: number; // Number of page to get.
  pageSize: number; // Number of items per page.
  sortBy?: TSortBy | undefined;
  sortDirection?: SortDirection | undefined;
};

export type PaginatedResult<T> = {
  items: T[];
  totalItems: number;
};

export type PaginatedResponseDto<T> = {
  data: T[];
  meta: {
    currentPage: number;
    itemsOnPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export function toPaginatedResponseDto<T>(
  result: PaginatedResult<T>,
  query: PaginationQuery,
): PaginatedResponseDto<T> {
  const totalPages = Math.ceil(result.totalItems / query.pageSize);

  return {
    data: result.items,
    meta: {
      currentPage: query.page,
      itemsOnPage: result.items.length,
      pageSize: query.pageSize,
      totalItems: result.totalItems,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    },
  };
}
