'use strict';

import React from 'react';
import ReactFireMixin from 'reactfire';
import _ from 'lodash';
//
import UserActions from '../../actions/UserActions';
//
import Config from '../../config/Config';
//
import History from '../../history/History';

/**
 *  User menu displays user links
 */
const UserMenu = React.createClass({

  mixins: [ReactFireMixin],

  componentWillMount() {
    if (this.props.info && this.props.info.id) {
      const userID = this.props.info.id;
      const ref = new Firebase(Config.FirebaseUrl + 'users/github:' + userID +
          '/active');
      this.bindAsObject(ref, 'userState');
    }
  },

  componentWillUpdate(nextProps, nextState) {
    if (nextState && nextState.userState) {
      if (!nextState.userState['.value']) {
        this.firebaseRefs.userState.set({'.value': true});
      }
    }
  },

  handleUsernameClick() {
    History.pushState(null, this.props.info.login);
  },

  handleLogoutClick() {
    UserActions.logout();
  },

  handleLoginClick() {
    UserActions.login();
  },

  render() {
    return (
      <div>
        { this.props.isLoggedIn ?
            [
              <a key="user-menu-username" href="#" onClick={this.handleUsernameClick}>
                {this.props.info.login}
              </a>,
              <span key="user-menu-divider" className="logged-in-user-divider"></span>,
              <a key="user-menu-logout" href="#" onClick={this.handleLogoutClick}>
                Logout
              </a>
            ] :
            <a key="user-menu-login" href="#" onClick={this.handleLoginClick}>
              Login
            </a>
        }
      </div>
    );
  }
});

export default UserMenu;
