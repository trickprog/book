import type { LucideIcon } from 'lucide-react';

const TONES = {
  muted: 'bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500',
  error: 'bg-red-50 text-red-500 dark:bg-red-950/50 dark:text-red-400',
}
export function Notice({
  icon: Icon,
  title,
  description,
  tone = 'muted',
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  tone: 'muted' | 'error';
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <span className={`grid h-20 w-20 place-items-center rounded-full ${TONES[tone]}`}>
        <Icon size={36} strokeWidth={1.5} />
      </span>

      <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-200">{title}</p>

      {description && (
        <p className="max-w-sm text-sm text-zinc-400 dark:text-zinc-500">{description}</p>
      )}

      {action && (
        <a
          href={action.href}
          className="mt-1 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
