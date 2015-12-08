'use strict';

import Reflux from 'reflux';
import request from 'superagent';
import _ from 'lodash';
//
import Config from '../config/Config';
//
import FilterActions from '../actions/FilterActions';

/**
 *  FilterStore processes filter options info
 */
const FilterStore = Reflux.createStore({
  listenables: [FilterActions],
  filters: [],

  getFilters() {
    this.filters = ['owner', 'collaborator', 'starred'];
    this.trigger(this.filters)
  }

});

export default FilterStore;
