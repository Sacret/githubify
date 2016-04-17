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
    defaultFilters: null,
    tagReposIds: [],
    isAllRepos: false,
    isAllTags: false
  },

  getFilters(filter) {
    this.filterInfo = {
      filter: filter || 'all',
      tags: [],
      languages: [],
      searchStr: '',
      defaultFilters: this.filterInfo.defaultFilters
    };
    this.trigger(this.filterInfo);
  },

  getDefaultFilters(defaultFilters) {
    this.filterInfo.defaultFilters = defaultFilters;
  },

  setFilter(username, filter) {
    ReposActions.initRepos();
    ReposActions.getRepos(username, 1, filter);
    this.getFilters(filter);
  },

  setTags(tags) {
    this.filterInfo.tags = tags;
    this.setFilters();
  },

  setTagsReposIds(tagReposIds) {
    this.filterInfo.tagReposIds = tagReposIds;
  },

  setLanguages(languages) {
    this.filterInfo.languages = languages;
    this.setFilters();
  },

  setSearch( searchStr) {
    this.filterInfo.searchStr = searchStr;
    this.setFilters();
  },

  setFilters() {
    ReposActions.filterRepos(this.filterInfo);
    this.trigger(this.filterInfo);
  },

  setDefaultFilters(isAllRepos, isAllTags) {
    if (isAllRepos) {
      this.filterInfo.isAllRepos = true;
    }
    if (isAllTags) {
      this.filterInfo.isAllTags = true;
    }
    this.trigger(this.filterInfo);
    if (this.filterInfo.isAllRepos && this.filterInfo.isAllTags && this.filterInfo.defaultFilters) {
      const { filter, searchStr } = this.filterInfo.defaultFilters;
      let { languages, tags } = this.filterInfo.defaultFilters;
      if (tags && !_.isArray(tags)) {
        tags = [tags];
      }
      if (languages && !_.isArray(languages)) {
        languages = [languages];
      }
      //
      this.filterInfo.filter = filter || 'all';
      this.filterInfo.languages = languages || [];
      this.filterInfo.tags = tags || [];
      this.filterInfo.searchStr = searchStr || '';
      this.setFilters();
      this.filterInfo.defaultFilters = null;
    }
  }

});

export default FilterStore;
