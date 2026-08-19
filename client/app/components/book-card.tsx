import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import { BookDialog } from './book-dialog';
import { Rating } from './rating';
import type { Book } from '@/lib/types';

export function BookCard({ book, priority = false }: { book: Book; priority?: boolean }) {
  const authors = book.authors.length > 0 ? book.authors.join(', ') : 'Unknown author';

  return (
    <article className="group flex flex-col gap-3">
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
            <BookOpen size={28} strokeWidth={1.5} className="text-zinc-400 dark:text-zinc-500" />
            <span className="line-clamp-3 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {book.title}
            </span>
          </div>
        )}

        <BookDialog book={book} />
      </div>

      <div className="flex flex-col gap-1">
        <h3
          title={book.title}
          className="line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50"
        >
          {book.title}
        </h3>
        <p title={authors} className="line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
          {authors}
          {book.firstPublishYear ? ` · ${book.firstPublishYear}` : ''}
        </p>
        <Rating book={book} />
      </div>
    </article>
  );
}
