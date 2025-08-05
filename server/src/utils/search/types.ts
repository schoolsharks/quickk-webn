export interface SearchConfig {
    model: any;
    searchableFields: string[];
    dateFields?: string[];
    populateFields?: string[];
}

export interface SearchQuery {
    [key: string]: any;
    page?: number;
    limit?: number;
}

export interface SearchResult<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}