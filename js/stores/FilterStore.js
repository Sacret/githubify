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
    tagReposIds: [],
    languageReposIds: []
  },

  getFilters() {
    this.filterInfo.filters = [{
      title: 'all',
      active: true
    }, {
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

  setFilter(username, filterTitle) {
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
    if (!(_.filter(_this.filterInfo.filters, { 'active': true })).length) {
      _this.filterInfo.filters[0].active = true;
    }
    //
    ReposActions.getRepos(username, 1, actualFilterTitle);
    _this.trigger(_this.filterInfo);
  },

  setFilterTags(username, tagReposIds) {
    this.filterInfo.tagReposIds = tagReposIds;
    const reposIds = this.getCombineReposIds();
    ReposActions.filterRepos(reposIds);
  },

  setFilterLanguages(username, languageReposIds) {
    this.filterInfo.languageReposIds = languageReposIds;
    const reposIds = this.getCombineReposIds();
    ReposActions.filterRepos(reposIds);
  },

  getCombineReposIds() {
    if (!this.filterInfo.tagReposIds.length && !this.filterInfo.languageReposIds.length) {
      return null;
    }
    if (!this.filterInfo.tagReposIds.length) {
      return this.filterInfo.languageReposIds;
    }
    if (!this.filterInfo.languageReposIds.length) {
      return this.filterInfo.tagReposIds;
    }
    return _.intersection(this.filterInfo.tagReposIds, this.filterInfo.languageReposIds);
  }

});

export default FilterStore;
