export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    current_page: number,
    data: T[],
    first_page_url: string,
    last_page: number,
    per_page: number,
    total: number,
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}