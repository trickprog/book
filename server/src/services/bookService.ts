import { ApiError } from '../lib/ErrorHandler';
import * as googleBooks from './googleBook';
import * as openLibrary from './openLibrary';
import { SearchParams, type Book, } from './types';

const DEFAULT_PAGE_SIZE = 10;
const SORTS = ['new', 'old', 'rating asc', 'rating desc'];

async function mergeRating(data: Book) {
    const { ...book } = data;
    const google = await googleBooks.getRating(book.title, book.authors[0]);

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

    const sort = query.sort ?? '';

    const result = await openLibrary.searchBooks({
        query: q,
        page: Number(query.page) || 1,
        pageSize: Number(query.pageSize) || DEFAULT_PAGE_SIZE,
        sort,
    });

    const books = await Promise.all(result.books.map(mergeRating));

    if (sort === 'rating asc') {
        books.sort((a, b) => (b.ratingAverage ?? -1) - (a.ratingAverage ?? -1));
    } else if (sort === 'rating desc') {
        books.sort((a, b) => (a.ratingAverage ?? -1) - (b.ratingAverage ?? -1));
    }


    return { ...result, books };
}

export async function getBookById(id: string) {

    if (!/^OL\d+W$/i.test(id)) {
        throw new ApiError(400, 'Book id must be an Open Library work id.');
    }
    const book = await openLibrary.getBookById(id.toUpperCase());
    return mergeRating(book);
}
