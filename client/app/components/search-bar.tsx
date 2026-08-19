'use client';

import { Loader2, Search, X } from 'lucide-react';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { updateSearch } from '@/lib/actions';
import type { BookQuery } from '@/lib/search-params';

const DEBOUNCE_MS = 700;

export function SearchBar({ query }: { query: BookQuery }) {
  const [value, setValue] = useState(query.q);
  const [pending, startTransition] = useTransition();

  const search = useCallback(
    (next: string) => {
      const trimmed = next.trim();
      if (trimmed === query.q) return; 
      startTransition(() => updateSearch({ q: trimmed }));
    },
    [query],
  );

  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed === query.q) return;

    const timer = setTimeout(() => search(value), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, query, search]);

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        search(value); 
      }}
      className="relative w-full max-w-sm"
    >
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
      />
      <input
        type="search"
        name="q"
        value={value}
        onChange={event => setValue(event.target.value)}
        placeholder="Search books, authors…"
        aria-label="Search books"
        className="w-full appearance-none rounded-full border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-950"
      />
      <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
        {pending ? (
          <Loader2 size={16} className="animate-spin text-zinc-400" />
        ) : (
          value && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setValue('');
                search('');
              }}
              className="grid place-items-center text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X size={16} />
            </button>
          )
        )}
      </span>
    </form>
  );
}
