import { useFilters } from '../filters';

/**
 *  SearchBlock contains search by repo name
 */
export default function SearchBlock() {
  const { filters, setFilters } = useFilters();

  function setSearch(searchStr) {
    setFilters({ searchStr }, { replace: true });
  }

  return (
    <div className="row">
      <div className="col-md-4 col-xs-12">
        <form className="search-block" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search repos"
                value={filters.searchStr}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="input-group-btn">
                <button type="submit" className="btn btn-default">
                  <i className="fa fa-search" />
                </button>
              </span>
            </div>
            {filters.searchStr ?
              <i
                className="fa fa-times-circle search-form-clear-icon"
                aria-hidden="true"
                onClick={() => setSearch('')}
              /> :
              null
            }
          </div>
        </form>
      </div>
    </div>
  );
}
