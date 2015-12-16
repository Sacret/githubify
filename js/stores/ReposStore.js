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
    filter: 'all',
    isScroll: true,
    nextPage: null
  },

  getRepos(accessToken, page, filter) {
    let _this = this;
    let reposUrl = 'repos';
    if (page == 1) {
      this.reposInfo.repos = [];
      this.reposInfo.isScroll = true;
      this.reposInfo.nextPage = null;
      this.reposInfo.filter = filter;
    }
    if (this.reposInfo.filter == 'starred') {
      reposUrl = 'starred';
    }
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
        _this.reposInfo.repos = _.union(_this.reposInfo.repos, res.body);
        if (res.body.length < Config.PerPage) {
          _this.reposInfo.isScroll = false;
        }
        else {
          _this.reposInfo.nextPage = page + 1;
        }
        _this.trigger(_this.reposInfo);
      });
  }

});

export default ReposStore;
