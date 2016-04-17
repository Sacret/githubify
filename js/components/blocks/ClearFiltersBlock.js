'use strict';

import React from 'react';
import Reflux from 'reflux';
//
import FilterActions from '../../actions/FilterActions';
import ReposActions from '../../actions/ReposActions';
//
import FilterStore from '../../stores/FilterStore';

/**
 *  ClearFiltersBlock contains link to clear all filters
 */
const ClearFiltersBlock = React.createClass({

  mixins: [Reflux.connect(FilterStore, 'filterStore')],

  clearFilters() {
    FilterActions.getFilters();
    ReposActions.initRepos();
    ReposActions.getRepos(this.props.uname, 1, 'all');
  },

  render() {
    const filterStore = this.state.filterStore;
    //
    const isFiltered = filterStore &&
      (
        filterStore.filter !== 'all' ||
        filterStore.tags && filterStore.tags.length ||
        filterStore.languages && filterStore.languages.length ||
        filterStore.searchStr.length
      );
    //
    return (
      <div className="clear-filters-block">
        { isFiltered ?
            <a
              href="#"
              className="clear-filters-block-inner"
              onClick={this.clearFilters}
            >
              Clear filters
            </a> :
            null
        }
      </div>
    );
  }
});

export default ClearFiltersBlock;
