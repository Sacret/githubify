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
    filter: 'all',
    tags: [],
    languages: [],
    searchStr: '',
    //
    tagReposIds: []
  },

  getFilters() {
    this.filterInfo = {
      filter: 'all',
      tags: [],
      languages: [],
      searchStr: ''
    };
    this.trigger(this.filterInfo);
  },

  setFilter(username, filter) {
    ReposActions.initRepos();
    ReposActions.getRepos(username, 1, filter, this.filterInfo.searchStr);
    this.getFilters();
    this.filterInfo.filter = filter;
    this.trigger(this.filterInfo);
  },

  setTags(username, tags, tagReposIds) {
    this.filterInfo.tags = tags;
    this.filterInfo.tagReposIds = tagReposIds;
    this.setFilters();
  },

  setLanguages(username, languages) {
    this.filterInfo.languages = languages;
    this.setFilters();
  },

  setSearch(username, searchStr) {
    this.filterInfo.searchStr = searchStr;
    this.setFilters();
  },

  setFilters() {
    ReposActions.filterRepos(this.filterInfo);
    this.trigger(this.filterInfo);
  }

});

export default FilterStore;
