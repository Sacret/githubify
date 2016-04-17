'use strict';

import Reflux from 'reflux';
import request from 'superagent';
import _ from 'lodash';
//
import Config from '../config/Config';
//
import ReposActions from '../actions/ReposActions';
import FilterActions from '../actions/FilterActions';

/**
 *  ReposStore processes repos info
 */
const ReposStore = Reflux.createStore({
  listenables: [ReposActions],
  reposInfo: {
    repos: [],
    filteredRepos: [],
    languages: [],
    isShowingOwner: false,
    username: null
  },

  initRepos() {
    this.reposInfo.repos = [];
    this.reposInfo.filteredRepos = [];
  },

  getRepos(username, page, filter) {
    const _this = this;
    let reposUrl = 'repos';
    if (filter == 'starred') {
      reposUrl = 'starred';
    }
    this.reposInfo.isShowingOwner = _.includes(['starred', 'member'], filter);
    const includeForks = filter == 'forks';
    //
    const requestUrl = Config.GithubApiUrl + 'users/' + username + '/' + reposUrl;
    const qs = {
      per_page: Config.PerPage,
      page: page,
      type: filter
    };
    //
    request
      .get(requestUrl, qs)
      .end(function(err, res) {
        if (err != null) {
          console.error(requestUrl, res.status, err.toString());
          _this.trigger(_this.reposInfo);
          return;
        }
        console.log('success GET-request: ' + requestUrl, res);
        //
        let newRepos = res.body;
        if (_.includes(['owner', 'forks'], filter)) {
          newRepos = _.filter(newRepos, (repo) => {
            return includeForks ? repo.fork : !repo.fork;
          });
        }
        //
        _this.reposInfo.repos = _.union(_this.reposInfo.repos, newRepos);
        _this.reposInfo.filteredRepos = _this.reposInfo.repos;
        //
        //
        const languages = _.chain(_this.reposInfo.repos)
          .pluck('language')
          .uniq()
          .compact()
          .value();
        _this.reposInfo.languages = languages;
        _this.trigger(_this.reposInfo);
        //
        if (res.body.length == Config.PerPage) {
          _this.getRepos(username, page + 1, filter);
        }
        else {
          FilterActions.setDefaultFilters(true, false);
        }
      });
  },

  filterRepos(filters) {
    const { tags, tagReposIds, languages, searchStr } = filters;
    let newRepos = this.reposInfo.repos;
    if (tags && tags.length) {
      newRepos = _.filter(newRepos, (repo) => {
        return _.includes(tagReposIds, repo.id);
      });
    }
    if (languages && languages.length) {
      newRepos = _.filter(newRepos, (repo) => {
        return _.includes(languages, repo.language);
      });
    }
    if (searchStr && searchStr.length) {
      newRepos = _.filter(newRepos, repo => {
        return _.includes(repo.name.toLowerCase(), searchStr.toLowerCase());
      });
    }
    this.reposInfo.filteredRepos = newRepos;
    this.trigger(this.reposInfo);
  }

});

export default ReposStore;
