'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTransition } from 'react';
import { updateSearch } from '@/lib/actions';

const WINDOW = 5;

const BASE =
  'grid h-9 min-w-9 cursor-pointer place-items-center rounded-full px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:text-zinc-300 dark:disabled:text-zinc-700';

function pageNumbers(page: number, totalPages: number): number[] {
  const size = Math.min(WINDOW, totalPages);
  const start = Math.min(Math.max(1, page - Math.floor(size / 2)), totalPages - size + 1);
  return Array.from({ length: size }, (_, index) => start + index);
}

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const [pending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  function go(target: number) {
    startTransition(() => updateSearch({ page: target }));
  }

  return (
    <nav
      aria-label="Pagination"
      className={`mt-10 flex flex-col items-center gap-3 ${pending ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className={`${BASE} text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800`}
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers(page, totalPages).map(number => (
          <button
            key={number}
            type="button"
            onClick={() => go(number)}
            aria-current={number === page ? 'page' : undefined}
            className={`${BASE} ${
              number === page
                ? 'bg-blue-600 text-white'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
            }`}
          >
            {number}
          </button>
        ))}

        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className={`${BASE} text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800`}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        Page {page.toLocaleString()} of {totalPages.toLocaleString()}
      </p>
    </nav>
  );
}
