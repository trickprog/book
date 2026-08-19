export type RatingSource = 'google-books' | 'open-library';

export interface Book {
  id: string;
  title: string;
  authors: string[];
  firstPublishYear?: number;
  coverUrl?: string;
  ratingAverage?: number;
  ratingCount?: number;
  ratingSource?: RatingSource;
  description?: string;
  subjects?: string[];
  openLibraryUrl: string;
}

export interface BookSearchResult {
  books: Book[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
