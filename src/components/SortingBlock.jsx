import { useFilters } from '../filters';

const OPTIONS = [
  ['name', 'Title'],
  ['created_at', 'Created date'],
  ['updated_at', 'Updated date'],
  ['stargazers_count', 'Stars']
];

/**
 *  Sorting block displays select element for sorting
 */
export default function SortingBlock() {
  const { filters, setFilters } = useFilters();

  function handleChange(e) {
    const [sort, direction] = e.target.value.split(':');
    setFilters({ sort, direction });
  }

  return (
    <form className="repos-block-sort-input">
      <div className="form-group">
        <select
          className="form-control"
          value={filters.sort + ':' + filters.direction}
          onChange={handleChange}
        >
          {OPTIONS.flatMap(([sort, title]) => ['asc', 'desc'].map((direction) => (
            <option key={sort + direction} value={sort + ':' + direction}>
              {title} ({direction})
            </option>
          )))}
        </select>
      </div>
    </form>
  );
}
