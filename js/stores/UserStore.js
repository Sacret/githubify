'use strict';

import Reflux from 'reflux';
import request from 'superagent';
import _ from 'lodash';
//
import Config from '../config/Config';
//
import UserActions from '../actions/UserActions';
import ReposActions from '../actions/ReposActions';

/**
 *  UserStore processes user info
 */
const UserStore = Reflux.createStore({
  listenables: [UserActions],
  user: {
    isLoggedIn: false,
    accessToken: '',
    info: {},
    uid: null,
    openUser: null
  },

  login() {
    const _this = this;
    const ref = new Firebase(Config.FirebaseUrl);
    //
    ref.authWithOAuthPopup('github', (error, authData) => {
      if (error) {
        console.log('Login Failed!', error);
        _this.user = {
          isLoggedIn: false
        };
        _this.trigger(_this.user);
      } else {
        console.log('Authenticated successfully with payload:', authData);
        _this.user = {
          isLoggedIn: true,
          accessToken: authData.github.accessToken,
          info: authData.github.cachedUserProfile,
          uid: authData.uid
        };
        _this.trigger(_this.user);
      }
    });
  },

  isLoggedIn() {
    const ref = new Firebase(Config.FirebaseUrl);
    const authData = ref.getAuth();
    //
    if (authData) {
      console.log('User ' + authData.uid + ' is logged in with ' + authData.provider);
      this.user = {
        isLoggedIn: true,
        accessToken: authData.github.accessToken,
        info: authData.github.cachedUserProfile,
        uid: authData.uid
      };
    } else {
      console.log('User is logged out');
      this.user = {
        isLoggedIn: false
      };
    }
    this.trigger(this.user);
  },

  logout() {
    const ref = new Firebase(Config.FirebaseUrl);
    ref.unauth();
    //
    this.user = {
      isLoggedIn: false
    };
    this.trigger(this.user);
  },

  getUser(accessToken, username) {
    const _this = this;
    const requestUrl = Config.GithubApiUrl + 'users/' + username;
    const qs = {
      access_token: accessToken
    };
    //
    request
      .get(requestUrl, qs)
      .end(function(err, res) {
        if (err != null) {
          console.error(requestUrl, res.status, err.toString());
          return;
        }
        console.log('success GET-request: ' + requestUrl, res);
        //
        _this.user.openUser = res.body;
        _this.trigger(_this.user);
        ReposActions.getRepos(username, 1, 'all', [], true);
      });
  }

});

export default UserStore;
