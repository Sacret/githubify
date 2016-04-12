'use strict';

import React from 'react';
import Reflux from 'reflux';
//
import FilterActions from '../../actions/FilterActions';
//
import FilterStore from '../../stores/FilterStore';

/**
 *  ClearFiltersBlock contains link to clear all filters
 */
const ClearFiltersBlock = React.createClass({

  mixins: [Reflux.connect(FilterStore, 'filterStore')],

  clearFilters() {
    FilterActions.clearFilters(this.props.uname);
  },

  render() {
    const filterStore = this.state.filterStore;
    console.log('filterStore', filterStore);
    //
    const isFiltered = filterStore &&
      (
        filterStore.currentFilter !== 'all' ||
        filterStore.tagReposIds.length ||
        filterStore.languageReposIds.length ||
        filterStore.searchStr.length
      );
    console.log('isFiltered', isFiltered);
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
