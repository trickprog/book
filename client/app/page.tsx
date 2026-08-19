import { BookX, TriangleAlert } from 'lucide-react';
import { cookies } from 'next/headers';
import { BookCard } from './components/book-card';
import { Notice } from './components/notice';
import { Pagination } from './components/pagination';
import { QuerySelect } from './components/query-select';
import { SearchBar } from './components/search-bar';
import { searchBooks } from '@/lib/api';
import {
  PAGE_COOKIE,
  PAGE_SIZE_COOKIE,
  PAGE_SIZE_OPTIONS,
  SEARCH_COOKIE,
  SORT_COOKIE,
  SORT_OPTIONS,
  parseBookQuery,
} from '@/lib/search-params';
import type { BookSearchResult } from '@/lib/types';

const DEFAULT_QUERY = 'All Books';

export default async function Home() {
  const store = await cookies();
  const query = parseBookQuery({
    q: store.get(SEARCH_COOKIE)?.value,
    sort: store.get(SORT_COOKIE)?.value,
    page: store.get(PAGE_COOKIE)?.value,
    pageSize: store.get(PAGE_SIZE_COOKIE)?.value,
  });

  let result: BookSearchResult | null = null;
  let error: string | null = null;

  try {
    result = await searchBooks({
      query: query.q || DEFAULT_QUERY,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });
  } catch (caught) {
    error = caught instanceof Error ? caught.message : 'Could not load books.';
  }

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-6xl px-6 py-10">
        <header className="mb-8 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Books
            </h1>
            <SearchBar query={query} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {result && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {result.totalItems.toLocaleString()} results for “{query.q || DEFAULT_QUERY}”
              </p>
            )}
            <div className="flex items-center gap-2">
              <QuerySelect
                label="Sort"
                name="sort"
                value={query.sort}
                options={SORT_OPTIONS}
              />
              <QuerySelect
                label="Show"
                name="pageSize"
                value={String(query.pageSize)}
                options={PAGE_SIZE_OPTIONS.map(size => ({
                  value: String(size),
                  label: String(size),
                }))}
              />
            </div>
          </div>
        </header>

        {error && (
          <Notice
            icon={TriangleAlert}
            tone="error"
            title="Can not find any book"
            description={error}
            action={{ href: '/', label: 'Try again' }}
          />
        )}

        {result && result.books.length === 0 && (
          <Notice
            icon={BookX}
            tone="muted"
            title="No books found"
            description="Try a different title, author, or keyword."
          />
        )}

        {result && result.books.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
              {result.books.map((book, index) => (
                <BookCard key={book.id} book={book} priority={index < 4} />
              ))}
            </div>
            <Pagination page={query.page} totalPages={result.totalPages} />
          </>
        )}
      </main>
    </div>
  );
}
