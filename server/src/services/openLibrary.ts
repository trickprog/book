import { url } from 'inspector/promises';
import { config } from '../config';
import { ApiError } from '../lib/ErrorHandler';
import {
    Book,
    Doc,
    SearchResponse,
    type SearchParams,
} from './types';


const FIELDS = [
    'key',
    'title',
    'author_name',
    'first_publish_year',
    'cover_i',
    'ratings_average',
    'ratings_count',
].join(',');

const SORTS: Record<string, string> = {
    newest: 'new',
    oldest: 'old',
    rating: 'rating',
};


function FormatResponseData(doc: Doc): Book | null {
    if (!doc.key || !doc.title) return null;
    const id = doc.key.replace('/works/', '');
    const hasRating = typeof doc.ratings_average === 'number' && (doc.ratings_count ?? 0) > 0;

    return {
        id,
        title: doc.title.trim(),
        authors: doc.author_name ?? [],
        firstPublishYear: doc.first_publish_year,
        coverUrl: doc.cover_i ? `${config.bookCoverUrl}/${doc.cover_i}-M.jpg` : undefined,
        ratingAverage: hasRating ? parseFloat((Math.round(doc.ratings_average! * 10) / 10).toFixed(2)) : undefined,
        ratingCount: hasRating ? doc.ratings_count : undefined,
        openLibraryUrl: `${config.openlibrarySearchUrl}/works/${id}`,
    };
}

function searchUrl(q: string, page: number, limit: number, sort?: string): URL {
    const url = new URL(`${config.openlibrarySearchUrl}/search.json`);
    url.searchParams.set('q', q);
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('fields', FIELDS);
    if (sort) url.searchParams.set('sort', sort);
    return url;
}

export async function searchBooks(params: SearchParams) {
    const url = searchUrl(
        params.query.trim(),
        params.page,
        params.pageSize,
        params.sort ? SORTS[params.sort] : undefined,
    );

    const response: SearchResponse = await fetch(url, {
        signal: AbortSignal.timeout(20000),
        headers: { Accept: 'application/json', 'User-Agent': 'BookApp/1.0' },
    }).then(res => res.json());

    const docs = response.docs ?? [];
    const totalItems = response.numFound ?? docs.length;
    return {
        books: docs.map(FormatResponseData).filter((book): book is Book => book !== null),
        page: params.page,
        pageSize: params.pageSize,
        totalItems,
        totalPages: Math.max(1, Math.ceil(totalItems / params.pageSize)),
    };
}

export async function getBookById(id: string) {

    const response: SearchResponse = await fetch(searchUrl(`key:/works/${id}`, 1, 1), {
        signal: AbortSignal.timeout(20000),
        headers: { Accept: 'application/json', 'User-Agent': 'BookApp/1.0' },
    }).then(res => res.json());

    const doc = response.docs?.[0];
    const book = doc ? FormatResponseData(doc) : null;

    if (!book) throw new ApiError(404, `No book found for id "${id}".`);
    return book;
}
