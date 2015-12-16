'use strict';

import Reflux from 'reflux';
import request from 'superagent';
import _ from 'lodash';
//
import Config from '../config/Config';
//
import FilterActions from '../actions/FilterActions';
import ReposActions from '../actions/ReposActions';

/**
 *  FilterStore processes filter options info
 */
const FilterStore = Reflux.createStore({
  listenables: [FilterActions],
  filters: [],

  getFilters() {
    this.filters = [{
      title: 'owner',
      active: false
    }, {
      title: 'member',
      active: false
    }, {
      title: 'starred',
      active: false
    }];
    this.trigger(this.filters);
  },

  setFilter(accessToken, filterTitle) {
    let _this = this;
    let actualFilterTitle = 'all';
    _.forEach(_this.filters, (filter, index) => {
      if (filter.title == filterTitle) {
        _this.filters[index].active = !_this.filters[index].active;
        if (_this.filters[index].active) {
          actualFilterTitle = filterTitle;
        }
      }
      else {
        _this.filters[index].active = false;
      }
    });
    //
    ReposActions.getRepos(accessToken, 1, actualFilterTitle);
    _this.trigger(_this.filters);
  }

});

export default FilterStore;
