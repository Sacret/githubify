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

  componentDidMount() {
    FilterActions.getFilters();
  },

  filterRepos(filterTitle) {
    FilterActions.setFilter(this.props.accessToken, filterTitle);
  },

  render() {
    let filterStore = this.state.filterStore;
    console.log('filterStore', filterStore);
    //
    let filters = 'There are no filters for now!';
    if (filterStore) {
      filters = _.map(filterStore.filters, (filter, index) => {
        return (
          <span
            className={'filter' + (filter.active ? ' active' : '')}
            key={'filter' + index}
            onClick={() => this.filterRepos(filter.title)}
          >
            {filter.title}
          </span>
        );
      });
    }
    //
    return (
      <div className="filters-block">
        {filters}
      </div>
    );
  }
});

export default FilterBlock;
