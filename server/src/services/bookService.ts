import { ApiError } from '../lib/ErrorHandler';
import * as googleBooks from './googleBook';
import * as openLibrary from './openLibrary';
import { SearchParams, type Book, } from './types';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;
const SORTS = ['relevance', 'newest', 'oldest', 'rating', 'rating-asc'] as const;

type Sort = (typeof SORTS)[number];

function parseSort(value?: string): Sort {
    if (!value) return 'relevance';
    if (!SORTS.includes(value as Sort)) {
        throw new ApiError(400, `Sort must be one of: ${SORTS.join(', ')}.`);
    }
    return value as Sort;
}

function parsePage(value?: number): number {
    const page = Math.trunc(Number(value)) || 1;
    if (page < 1) throw new ApiError(400, 'Page must be 1 or greater.');
    return page;
}

function parsePageSize(value?: number): number {
    const pageSize = Math.trunc(Number(value)) || DEFAULT_PAGE_SIZE;
    if (pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
        throw new ApiError(400, `Page size must be between 1 and ${MAX_PAGE_SIZE}.`);
    }
    return pageSize;
}

async function mergeRating(data: Book) {
    const { ...book } = data;
    const google = await googleBooks.getRating(book.title, book.authors[0]);
    console.log('google book service:', google);
    if (!google) {
        return book.ratingAverage !== undefined
            ? { ...book, ratingSource: 'open-library' }
            : book;
    }

    return {
        ...book,
        ratingAverage: Math.round(google.average * 10) / 10,
        ratingCount: google.count,
        ratingSource: 'google-books',
    };
}

export async function searchBooks(query: SearchParams) {
    const q = query.query.trim();
    if (!q) throw new ApiError(400, 'Query parameter not provided.');
    if (q.length > 200) throw new ApiError(400, 'Query cannot be too long (max 200 characters).');

    const sort = parseSort(query.sort);

    const result = await openLibrary.searchBooks({
        query: q,
        page: parsePage(query.page),
        pageSize: parsePageSize(query.pageSize),
        sort,
    });

    const books = await Promise.all(result.books.map(mergeRating));

    if (sort === 'rating') {
        books.sort((a, b) => (b.ratingAverage ?? -1) - (a.ratingAverage ?? -1));
    } else if (sort === 'rating-asc') {
        books.sort((a, b) => (a.ratingAverage ?? Infinity) - (b.ratingAverage ?? Infinity));
    }

    return { ...result, books, sort };
}

export async function getBookById(id: string) {

    if (!/^OL\d+W$/i.test(id)) {
        throw new ApiError(400, 'Book id must be an Open Library work id.');
    }
    const book = await openLibrary.getBookById(id.toUpperCase());
    console.log('open library specific book service:', book);
    return mergeRating(book);
}
