import { useState } from 'react';

export function usePagination(total, perPage = 8) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(total / perPage));
  const cur = Math.min(page, pages);
  return { page: cur, setPage, pages, range: [(cur - 1) * perPage, cur * perPage] };
}
