export class PaginatedInterface<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };

  links: {
    firstPage: string;
    lastPage: string;
    currentPage: string;
    nextPage: string;
    prevPage: string;
  };
}
