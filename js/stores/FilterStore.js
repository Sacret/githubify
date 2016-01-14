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
  filterInfo: {
    filters: [],
    currentFilter: 'all',
    tags: [],
    reposIds: []
  },

  getFilters() {
    this.filterInfo.filters = [{
      title: 'owner',
      active: false
    }, {
      title: 'forks',
      active: false
    }, {
      title: 'member',
      active: false
    }, {
      title: 'starred',
      active: false
    }];
    this.trigger(this.filterInfo);
  },

  setFilter(accessToken, filterTitle) {
    const _this = this;
    let actualFilterTitle = 'all';
    _.forEach(_this.filterInfo.filters, (filter, index) => {
      if (filter.title == filterTitle) {
        let activeStatus = _this.filterInfo.filters[index].active;
        _this.filterInfo.filters[index].active = !activeStatus;
        if (_this.filterInfo.filters[index].active) {
          actualFilterTitle = filterTitle;
          _this.filterInfo.currentFilter = filterTitle;
        }
        else {
          _this.filterInfo.currentFilter = 'all';
        }
      }
      else {
        _this.filterInfo.filters[index].active = false;
      }
    });
    //
    ReposActions.getRepos(accessToken, 1, actualFilterTitle, this.filterInfo.reposIds);
    _this.trigger(_this.filterInfo);
  },

  setFilterTags(accessToken, newTag, isTagsAdding) {
    if (isTagsAdding) {
      this.filterInfo.tags = _.union(this.filterInfo.tags, [newTag]);
    }
    else {
      this.filterInfo.tags = _.reject(this.filterInfo.tags, newTag);
    }
    const reposIds = _.map(this.filterInfo.tags, (tag) => {
      return _(tag.repos).values().pluck('id').value();
    });
    this.filterInfo.reposIds = _(reposIds).flatten().uniq().value();
    ReposActions.getRepos(accessToken, 1, this.filterInfo.currentFilter, this.filterInfo.reposIds);
  }

});

export default FilterStore;
