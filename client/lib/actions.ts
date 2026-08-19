'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT,
  PAGE_COOKIE,
  PAGE_SIZE_COOKIE,
  SEARCH_COOKIE,
  SORT_COOKIE,
} from './search-params';

const COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 30,
} as const;

export interface SearchPatch {
  q?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Stores the search state in cookies and reloads the grid, so the URL stays clean.
 * Anything left at its default is deleted rather than stored.
 */
export async function updateSearch(patch: SearchPatch) {
  const store = await cookies();

  function write(name: string, value: string | undefined) {
    if (value) store.set(name, value, COOKIE_OPTIONS);
    else store.delete(name);
  }

  if (patch.q !== undefined) write(SEARCH_COOKIE, patch.q.trim());
  if (patch.sort !== undefined) write(SORT_COOKIE, patch.sort === DEFAULT_SORT ? undefined : patch.sort);
  if (patch.pageSize !== undefined) {
    write(PAGE_SIZE_COOKIE, patch.pageSize === DEFAULT_PAGE_SIZE ? undefined : String(patch.pageSize));
  }

  // Only paging keeps the current page; changing anything else starts over at one.
  const page = patch.page ?? 1;
  write(PAGE_COOKIE, page > 1 ? String(page) : undefined);

  redirect('/');
}
