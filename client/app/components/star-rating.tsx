import { Star } from 'lucide-react';

export function StarRating({
  value,
  size = 14,
  gap = 2,
}: {
  value: number;
  size?: number;
  gap?: number;
}) {
  const width = size * 5 + gap * 4;
  const filled = (Math.min(Math.max(value, 0), 5) / 5) * 100;

  return (
    <span className="relative inline-flex shrink-0" style={{ width, height: size }}>
      <span className={`flex text-amber-400`} style={{ gap }}>
        {Array.from({ length: 5 }, (_, index) => (
          <Star key={index} size={size} strokeWidth={1.5} className="shrink-0 fill-current" />
        ))}
      </span>
      <span
        className="absolute left-0 top-0 overflow-hidden"
        style={{ width: `${filled}%`, height: size }}
      >
        <span className="block" style={{ width }}>
          <span className={`flex text-amber-400`} style={{ gap }}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} size={size} strokeWidth={1.5} className="shrink-0 fill-current" />
            ))}
          </span>
        </span>
      </span>
    </span>
  );
}
