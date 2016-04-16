'use strict';

import React from 'react';
import Rebase from 're-base';
import _ from 'lodash';
//
import UserActions from '../../actions/UserActions';
//
import Config from '../../config/Config';
//
import History from '../../history/History';

const base = Rebase.createClass(Config.FirebaseUrl);

/**
 *  User menu displays user links
 */
const UserMenu = React.createClass({

  componentDidMount() {
    if (this.props.isLoggedIn) {
      const userID = this.props.info.id;
      this.ref = base.syncState('users/github:' + userID, {
        context: this,
        state: 'user',
        asObject: true,
        then() {
          if (!this.state.user.active) {
            this.setState({
              user: {
                active: true,
                username: this.props.info.login
              }
            });
          }
        }
      });
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
