'use strict';

import Reflux from 'reflux';
import request from 'superagent';
import _ from 'lodash';
//
import Config from '../config/Config';
//
import ReposActions from '../actions/ReposActions';
import LanguagesActions from '../actions/LanguagesActions';
import TagsActions from '../actions/TagsActions';

/**
 *  ReposStore processes repos info
 */
const ReposStore = Reflux.createStore({
  listenables: [ReposActions],
  reposInfo: {
    repos: [],
    filteredRepos: [],
    alertType: '',
    alertMessage: '',
    isShowingOwner: false,
    username: null
  },

  getRepos(username, page, filter, searchStr) {
    const _this = this;
    let reposUrl = 'repos';
    if (page == 1) {
      this.reposInfo.repos = [];
    }
    if (filter == 'starred') {
      reposUrl = 'starred';
    }
    if (!username) {
      username = this.reposInfo.username;
    }
    this.reposInfo.isShowingOwner = filter == 'starred' || filter == 'member';
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
          _this.reposInfo = {
            alertType: 'danger',
            alertMessage: 'Something went wrong!'
          };
          _this.trigger(_this.reposInfo);
          return;
        }
        console.log('success GET-request: ' + requestUrl, res);
        //
        let newRepos = res.body;
        newRepos = _.filter(newRepos, (repo) => {
          return includeForks ? repo.fork : !repo.fork;
        });
        //
        _this.reposInfo.repos = _.union(_this.reposInfo.repos, newRepos);
        _this.reposInfo.filteredRepos = searchStr && searchStr.length ?
          _.filter(_this.reposInfo.repos, repo => {
            return _.includes(repo.name.toLowerCase(), searchStr.toLowerCase());
          }) :
          _this.reposInfo.repos;
        //
        if (res.body.length == Config.PerPage) {
          _this.getRepos(username, page + 1, filter, searchStr)
        }
        _this.trigger(_this.reposInfo);
        //
        const languages = _.chain(_this.reposInfo.repos)
          .pluck('language')
          .uniq()
          .compact()
          .value();
        LanguagesActions.setLanguages(languages);
        LanguagesActions.setActiveLanguages([]);
        TagsActions.setActiveTags([]);
      });
  },

  filterRepos(filterReposIds, searchStr) {
    let newRepos = [];
    if (filterReposIds) {
      newRepos = _.filter(this.reposInfo.repos, (repo) => {
        return _.includes(filterReposIds, repo.id);
      });
    }
    else {
      newRepos = this.reposInfo.repos;
    }
    if (!searchStr.length) {
      this.reposInfo.filteredRepos = newRepos;
    }
    else {
      this.reposInfo.filteredRepos = _.filter(newRepos, repo => {
        return _.includes(repo.name.toLowerCase(), searchStr.toLowerCase());
      });
    }
    this.trigger(this.reposInfo);
  }

});

export default ReposStore;
