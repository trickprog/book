import type { Book, BookSearchResult } from './types';

const API_URL = process.env.API_URL ?? 'http://localhost:5000/api/v1';

export interface SearchOptions {
  query: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export async function searchBooks(options: SearchOptions): Promise<BookSearchResult> {
  const url = new URL(`${API_URL}/books`);
  url.searchParams.set('q', options.query);
  url.searchParams.set('page', String(options.page ?? 1));
  url.searchParams.set('pageSize', String(options.pageSize ?? 12));
  if (options.sort) url.searchParams.set('sort', options.sort);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(20000),
      next: { revalidate: 300 },
    });
  } catch (caught) {
    throw new Error(
      caught instanceof Error && caught.name === 'TimeoutError'
        ? 'The books API took too long to respond.'
        : 'Could not reach the books API.',
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Book search failed (${response.status}).`);
  }

  return response.json();
}


export async function getBook(id: string): Promise<Book> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/books/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(20000),
    });
  } catch (caught) {
    throw new Error(
      caught instanceof Error && caught.name === 'TimeoutError'
        ? 'The books API took too long to respond.'
        : 'Could not reach the books API.',
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Could not load that book (${response.status}).`);
  }

  return response.json();
}