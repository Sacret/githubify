import { REPO_FILTERS, useFilters } from '../filters';

/**
 *  FilterBlock contains list of all filters
 */
export default function FilterBlock() {
  const { filters, clearFilters } = useFilters();

  return (
    <div className="filters-block">
      {REPO_FILTERS.map((filter) => (
        <span
          className={'filter' + (filter === filters.filter ? ' active' : '')}
          key={filter}
          onClick={() => clearFilters(filter)}
        >
          {filter}
        </span>
      ))}
    </div>
  );
}
