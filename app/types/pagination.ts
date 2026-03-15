export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    page: number
    lastPage: number
    perPage: number
  }
}
