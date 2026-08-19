export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'rating', label: 'Top rated' },
] as const;

export const PAGE_SIZE_OPTIONS = [12, 24, 48] as const;

export const SEARCH_COOKIE = 'query';
export const SORT_COOKIE = 'sort';
export const PAGE_COOKIE = 'page';
export const PAGE_SIZE_COOKIE = 'pageSize';

export const DEFAULT_SORT = 'relevance';
export const DEFAULT_PAGE_SIZE = 12;

export interface BookQuery {
  q: string;
  sort: string;
  page: number;
  pageSize: number;
}

export function parseBookQuery(raw: Partial<Record<keyof BookQuery, string>>): BookQuery {
  const sort = raw.sort ?? DEFAULT_SORT;
  const page = Number(raw.page);
  const pageSize = Number(raw.pageSize);

  return {
    q: raw.q?.trim() ?? '',
    sort: SORT_OPTIONS.some(option => option.value === sort) ? sort : DEFAULT_SORT,
    page: Number.isInteger(page) && page > 0 ? page : 1,
    pageSize: (PAGE_SIZE_OPTIONS as readonly number[]).includes(pageSize)
      ? pageSize
      : DEFAULT_PAGE_SIZE,
  };
}
