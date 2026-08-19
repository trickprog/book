'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useState, useTransition } from 'react';
import { updateSearch } from '@/lib/actions';

interface Option {
  value: string;
  label: string;
}

export function QuerySelect({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: 'sort' | 'pageSize';
  value: string;
  options: readonly Option[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const selected = options.find(option => option.value === value) ?? options[0];

  function choose(option: Option) {
    setOpen(false);
    if (option.value === value) return;
    startTransition(() =>
      updateSearch(
        name === 'sort' ? { sort: option.value } : { pageSize: Number(option.value) },
      ),
    );
  }

  return (
    <div
      className="relative"
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        className={`flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200 bg-white py-2 pl-3.5 pr-3 text-xs shadow-sm transition hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:focus-visible:ring-blue-950 ${
          pending ? 'opacity-60' : ''
        }`}
      >
        <span className="text-zinc-400 dark:text-zinc-500">{label}</span>
        <span className="font-medium text-zinc-800 dark:text-zinc-100">{selected.label}</span>
        <ChevronDown
          size={14}
          className={`text-zinc-400 transition-transform dark:text-zinc-500 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <ul className="absolute right-0 z-20 mt-2 min-w-36 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          {options.map(option => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => choose(option)}
                className="w-full cursor-pointer flex items-center justify-between gap-4 rounded-lg px-3 py-2 text-xs text-zinc-600 transition hover:bg-zinc-100 focus-visible:bg-zinc-100 focus-visible:outline-none dark:text-zinc-300 dark:hover:bg-zinc-800 dark:focus-visible:bg-zinc-800"
              >
                {option.label}
                {option.value === value && <Check size={13} className="text-blue-600" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
