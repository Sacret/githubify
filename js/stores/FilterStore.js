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

  setFilterTags(username, newTag, isTagsAdding) {
    if (isTagsAdding) {
      this.filterInfo.tags = _.union(this.filterInfo.tags, [newTag]);
    }
    else {
      this.filterInfo.tags = _.reject(this.filterInfo.tags, newTag);
    }
    const tagReposIds = _.map(this.filterInfo.tags, (tag) => {
      return _(tag.repos).values().pluck('id').value();
    });
    this.filterInfo.tagReposIds = _(tagReposIds)
      .flatten()
      .uniq()
      .value();
    const reposIds = this.getCombineReposIds();
    ReposActions.filterRepos(reposIds);
  },

  setFilterLanguages(username, languageReposIds, activeLanguages) {
    const newReposIds = _.union(this.filterInfo.languageReposIds, languageReposIds);
    this.filterInfo.languageReposIds = newReposIds;
    const reposIds = this.getCombineReposIds();
    ReposActions.filterRepos(reposIds, activeLanguages);
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
