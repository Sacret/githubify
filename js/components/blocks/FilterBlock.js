'use strict';

import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';
//
import { Input, Button, Alert } from 'react-bootstrap';
//
import FilterActions from '../../actions/FilterActions';
//
import FilterStore from '../../stores/FilterStore';

/**
 *  FilterBlock contains list of all filters
 */
const FilterBlock = React.createClass({

  mixins: [Reflux.connect(FilterStore, 'filterStore')],

  filterRepos(filter) {
    FilterActions.setFilter(this.props.uname, filter);
  },

  render() {
    const filterStore = this.state.filterStore;
    console.log('filterStore', filterStore);
    const activeFilter = filterStore ? filterStore.filter : 'all';
    //
    const filters = ['all', 'owner', 'forks', 'member', 'starred'];
    //
    let filterBlock = 'There are no filters for now!';
    if (filterStore) {
      filterBlock = _.map(filters, (filter, index) => {
        return (
          <span
            className={'filter' + (filter === activeFilter ? ' active' : '')}
            key={'filter' + index}
            onClick={() => this.filterRepos(filter)}
          >
            {filter}
          </span>
        );
      });
    }
    //
    return (
      <div className="filters-block">
        {filterBlock}
      </div>
    );
  }
});

export default FilterBlock;
