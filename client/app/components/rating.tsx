import { Library } from 'lucide-react';
import { SiGoogle } from 'react-icons/si';
import { StarRating } from './star-rating';
import type { Book, RatingSource } from '@/lib/types';

const RATING_SOURCE = {
  'google-books': { label: 'Google Books', Icon: SiGoogle },
  'open-library': { label: 'Open Library', Icon: Library },
}

function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1).replace('.0', '')}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace('.0', '')}k`;
  return String(count);
}

function SourceIcon({ source, size }: { source: RatingSource; size: number }) {
  const { label, Icon } = RATING_SOURCE[source];

  return (
    <span
      title={`Rating from ${label}`}
      className="grid place-items-center rounded-full bg-zinc-100 p-1 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
    >
      <Icon size={size} />
      <span className="sr-only">Rating from {label}</span>
    </span>
  );
}

export function Rating({ book, size = 14 }: { book: Book; size?: number }) {
  if (book.ratingAverage === undefined) {
    return <p className="text-xs text-zinc-400 dark:text-zinc-500">No ratings yet</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
      <StarRating value={book.ratingAverage} size={size} />
      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-100">
        {book.ratingAverage.toFixed(1)}
      </span>
      {book.ratingCount !== undefined && (
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          ({formatCount(book.ratingCount)})
        </span>
      )}
      {book.ratingSource && <SourceIcon source={book.ratingSource} size={size - 3} />}
    </div>
  );
}
