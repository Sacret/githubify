'use strict';

import Reflux from 'reflux';
import Rebase from 're-base';
import request from 'superagent';
import _ from 'lodash';
//
import UserActions from '../actions/UserActions';
import FilterActions from '../actions/FilterActions';
import ReposActions from '../actions/ReposActions';
//
import Config from '../config/Config';

const base = Rebase.createClass(Config.FirebaseUrl);

/**
 *  UserStore processes user info
 */
const UserStore = Reflux.createStore({
  listenables: [UserActions],
  user: {
    isLoggedIn: false,
    info: {},
    uid: null,
    openUser: null
  },

  login() {
    const _this = this;
    base.authWithOAuthPopup('github', (error, authData) => {
      if (error) {
        console.log('Login Failed!', error);
        _this.user.isLoggedIn = false;
        _this.trigger(_this.user);
      } else {
        console.log('Authenticated successfully with payload:', authData);
        _this.user.isLoggedIn = true;
        _this.user.info = authData.github.cachedUserProfile;
        _this.user.uid = authData.uid;
        _this.trigger(_this.user);
      }
    });
  },

  isLoggedIn() {
    const authData = base.getAuth();
    //
    if (authData) {
      console.log('User ' + authData.uid + ' is logged in with ' + authData.provider);
      this.user = {
        isLoggedIn: true,
        info: authData.github.cachedUserProfile,
        uid: authData.uid
      };
    } else {
      console.log('User is logged out');
      this.user.isLoggedIn = false;
    }
    this.trigger(this.user);
  },

  logout() {
    base.unauth();
    //
    this.user.isLoggedIn = false;
    this.trigger(this.user);
  },

  getUser(username) {
    const _this = this;
    const requestUrl = Config.GithubApiUrl + 'users/' + username;
    //
    request
      .get(requestUrl)
      .end(function(err, res) {
        if (err != null) {
          console.error(requestUrl, res.status, err.toString());
          _this.user.openUser = {
            isActive: false
          };
          _this.trigger(_this.user);
          return;
        }
        console.log('success GET-request: ' + requestUrl, res);
        //
        _this.user.openUser = res.body;
        _this.user.openUser.isActive = true;
        _this.trigger(_this.user);
      });
  }

});

export default UserStore;
