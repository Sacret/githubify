import { useSearchParams } from 'react-router';

export const REPO_FILTERS = ['all', 'owner', 'forks', 'member', 'starred'];
export const SORT_FIELDS = ['name', 'created_at', 'updated_at', 'stargazers_count'];

const DEFAULT_SORT = 'name';
const DEFAULT_DIRECTION = 'asc';

/**
 *  Filters live in the url query, so any page state can be shared by link.
 *  Param names are the same as in old shared links
 */
export function useFilters() {
  const [params, setParams] = useSearchParams();

  const filters = {
    filter: REPO_FILTERS.includes(params.get('filter')) ? params.get('filter') : 'all',
    tags: params.getAll('tags'),
    languages: params.getAll('languages'),
    searchStr: params.get('searchStr') || '',
    sort: SORT_FIELDS.includes(params.get('sort')) ? params.get('sort') : DEFAULT_SORT,
    direction: params.get('direction') === 'desc' ? 'desc' : DEFAULT_DIRECTION
  };

  function setFilters(changes, options) {
    const next = { ...filters, ...changes };
    const query = new URLSearchParams();
    if (next.filter !== 'all') {
      query.set('filter', next.filter);
    }
    next.tags.forEach((tag) => query.append('tags', tag));
    next.languages.forEach((language) => query.append('languages', language));
    if (next.searchStr) {
      query.set('searchStr', next.searchStr);
    }
    if (next.sort !== DEFAULT_SORT || next.direction !== DEFAULT_DIRECTION) {
      query.set('sort', next.sort);
      query.set('direction', next.direction);
    }
    setParams(query, options);
  }

  // Resets everything except sorting
  function clearFilters(filter = 'all') {
    setFilters({ filter, tags: [], languages: [], searchStr: '' });
  }

  const isFiltered = filters.filter !== 'all' || filters.tags.length > 0 ||
    filters.languages.length > 0 || filters.searchStr.length > 0;

  return { filters, setFilters, clearFilters, isFiltered };
}

export function toggle(list, item) {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

const collator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true });

export function filterRepos(repos, tags, filters) {
  const { languages, searchStr, sort, direction } = filters;
  let result = repos;
  if (filters.tags.length) {
    const ids = new Set();
    (tags || [])
      .filter((tag) => filters.tags.includes(tag.key))
      .forEach((tag) => Object.values(tag.repos).forEach((id) => ids.add(id)));
    result = result.filter((repo) => ids.has(repo.id));
  }
  if (languages.length) {
    result = result.filter((repo) => languages.includes(repo.language));
  }
  if (searchStr) {
    const search = searchStr.toLowerCase();
    result = result.filter((repo) => repo.name.toLowerCase().includes(search));
  }
  const sign = direction === 'desc' ? -1 : 1;
  return [...result].sort((a, b) => {
    const [x, y] = [a[sort], b[sort]];
    return sign * (typeof x === 'number' ? x - y : collator.compare(x || '', y || ''));
  });
}
