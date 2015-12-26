'use strict';

import Reflux from 'reflux';
import request from 'superagent';
import _ from 'lodash';
//
import Config from '../config/Config';
//
import ReposActions from '../actions/ReposActions';

/**
 *  ReposStore processes repos info
 */
const ReposStore = Reflux.createStore({
  listenables: [ReposActions],
  reposInfo: {
    repos: [],
    alertType: '',
    alertMessage: '',
    filter: 'all'
  },

  getRepos(accessToken, page, filter, filterReposIds) {
    let _this = this;
    let reposUrl = 'repos';
    if (page == 1) {
      this.reposInfo.repos = [];
      this.reposInfo.filter = filter;
    }
    if (this.reposInfo.filter == 'starred') {
      reposUrl = 'starred';
    }
    let includeForks = filter == 'forks';
    //
    let requestUrl = Config.GithubApiUrl + 'user/' + reposUrl;
    let qs = {
      access_token: accessToken,
      per_page: Config.PerPage,
      page: page,
      type: _this.reposInfo.filter
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
          _this.getRepos(accessToken, page + 1, filter, filterReposIds)
        }
        _this.trigger(_this.reposInfo);
      });
  }

});

export default ReposStore;
