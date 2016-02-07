'use strict';

import React from 'react';
import { hashHistory } from 'react-router';
//
import UserActions from '../../actions/UserActions';

/**
 *  User menu displays user links
 */
const UserMenu = React.createClass({

  handleUsernameClick() {
    hashHistory.push(this.props.info.login);
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
        { this.props.info ?
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
