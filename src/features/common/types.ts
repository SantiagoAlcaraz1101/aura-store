export interface PaginationData { page: number; limit: number; total: number; totalPages: number }
export interface Page<T> { pagination: PaginationData; data: T[] }
