export interface SearchParams {
    query: string;
    page: number;
    pageSize: number;
    sort?: string;
}

export interface Book {
    id: string;
    title: string;
    authors: string[];
    firstPublishYear?: number;
    coverUrl?: string;
    ratingAverage?: number;
    ratingCount?: number;
    ratingSource?: 'google-books' | 'open-library';
    openLibraryUrl: string;
}


export interface Doc {
    key?: string;
    title?: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
    isbn?: string[];
    ratings_average?: number;
    ratings_count?: number;
}

export interface SearchResponse {
    numFound?: number;
    docs?: Doc[];
}

export interface GoogleRating {
    average: number;
    count: number;
}

export interface VolumeInfo {
    title?: string;
    authors?: string[];
    averageRating?: number;
    ratingsCount?: number;
    industryIdentifiers?: {
        type: string;
        identifier: string;
    }[];
}
export interface VolumesResponse {
    items?: {
        volumeInfo: VolumeInfo
    }[];
}
