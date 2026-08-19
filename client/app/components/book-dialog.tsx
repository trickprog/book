'use client';

import { ExternalLink, Eye, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Rating } from './rating';
import { getBook } from '@/lib/api';
import type { Book } from '@/lib/types';

export function BookDialog({ book }: { book: Book }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [details, setDetails] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function open() {
    dialog.current?.showModal();
    if (details || loading) return;

    setLoading(true);
    setError(null);
    try {
      setDetails(await getBook(book.id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'can not load that book.');
    } finally {
      setLoading(false);
    }
  }

  const shown = details ?? book;

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="absolute inset-0 cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <span className="sr-only">View details for {book.title}</span>
      </button>

      <span className="pointer-events-none absolute inset-x-2.5 bottom-2.5 flex items-center justify-center gap-1.5 rounded-full bg-blue-600 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
        <Eye size={13} strokeWidth={2} />
        Quick view
      </span>

      <dialog
        ref={dialog}
        onClick={event => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-2xl bg-white p-0 text-zinc-900 shadow-2xl backdrop:bg-black/50 dark:bg-zinc-900 dark:text-zinc-50"
      >
        <div className="relative flex flex-col gap-5 p-6 sm:flex-row">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X size={16} />
          </button>

          {book.coverUrl && (
            <Image
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              width={144}
              height={208}
              className="h-52 w-36 shrink-0 self-center rounded-xl object-cover sm:self-start"
            />
          )}

          <div className="flex min-w-0 flex-col gap-3 pr-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold leading-snug">{book.title}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {book.authors.length > 0 ? book.authors.join(', ') : 'Unknown author'}
                {book.firstPublishYear ? ` · ${book.firstPublishYear}` : ''}
              </p>
            </div>

            <Rating book={shown} size={16} />

            {loading && (
              <p className="flex items-center gap-2 text-sm text-zinc-400">
                <Loader2 size={14} className="animate-spin" />
                Loading details…
              </p>
            )}

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            {shown.description && (
              <p className="max-h-48 overflow-y-auto whitespace-pre-line text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {shown.description}
              </p>
            )}

            {!loading && !error && !shown.description && (
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                No description on Open Library for this work.
              </p>
            )}

            {shown.subjects && shown.subjects.length > 0 && (
              <ul className="-mx-1 flex snap-x gap-1.5 overflow-x-auto px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {shown.subjects.map(subject => (
                  <li
                    key={subject}
                    className="shrink-0 snap-start whitespace-nowrap rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {subject}
                  </li>
                ))}
              </ul>
            )}

            <a
              href={book.openLibraryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
            >
              View on Open Library
              <ExternalLink size={13} strokeWidth={2} />
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
