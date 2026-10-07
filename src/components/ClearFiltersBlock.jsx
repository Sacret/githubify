import { useFilters } from '../filters';

/**
 *  ClearFiltersBlock contains link to clear all filters
 */
export default function ClearFiltersBlock() {
  const { clearFilters, isFiltered } = useFilters();

  return (
    <div className="clear-filters-block">
      {isFiltered ?
        <button
          type="button"
          className="btn-link clear-filters-block-inner"
          onClick={() => clearFilters()}
        >
          Clear filters
        </button> :
        null
      }
    </div>
  );
}
