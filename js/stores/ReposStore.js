'use strict';

import Reflux from 'reflux';
import request from 'superagent';
import _ from 'lodash';
//
import Config from '../config/Config';
//
import ReposActions from '../actions/ReposActions';
import LanguagesActions from '../actions/LanguagesActions';

/**
 *  ReposStore processes repos info
 */
const ReposStore = Reflux.createStore({
  listenables: [ReposActions],
  reposInfo: {
    repos: [],
    alertType: '',
    alertMessage: '',
    isShowingOwner: false,
    username: null
  },

  getRepos(username, page, filter, filterReposIds, isSetNewLanguages) {
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
        let newRepos = [];
        if (filterReposIds && filterReposIds.length) {
          newRepos = _.filter(res.body, (repo) => {
            return _.includes(filterReposIds, repo.id);
          });
        }
        else {
          newRepos = res.body;
        }
        //
        newRepos = _.filter(newRepos, (repo) => {
          return includeForks ? repo.fork : !repo.fork;
        });
        //
        _this.reposInfo.repos = _.union(_this.reposInfo.repos, newRepos);
        //
        if (res.body.length == Config.PerPage) {
          _this.getRepos(username, page + 1, filter, filterReposIds)
        }
        _this.trigger(_this.reposInfo);
        //
        if (isSetNewLanguages) {
          const languages = _.chain(_this.reposInfo.repos)
            .pluck('language')
            .uniq()
            .compact()
            .value();
          LanguagesActions.setLanguages(languages);
        }
      });
  }

});

export default ReposStore;
