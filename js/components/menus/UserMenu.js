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
            null
        }
      </div>
    );
  }
});

export default UserMenu;
