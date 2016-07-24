'use strict';

import React from 'react';
import Reflux from 'reflux';
//
import { Button, Alert } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
//
import ShareBlock from './ShareBlock';
//
import UserActions from '../../actions/UserActions';
//
import UserStore from '../../stores/UserStore';

/**
 *  LoginForm contains authorization form
 */
const LoginForm = React.createClass({

  mixins: [Reflux.connect(UserStore, 'userStore')],

  handleLoginClick() {
    UserActions.login();
  },

  render() {
    const userStore = this.state.userStore;
    //
    return (
      <div className="container login-container">
        <p className="login-header text-center">
          GITHUBIFY.<span className="header-title">me</span>
        </p>
        <h4 className="login-page-paragraph">
          Welcome to the place where you can easily manage and organize tags for your Github repositories. You will have ability to set tags for your own repos, repositories that you have been added to as a member and even starred repos!
        </h4>
        <h4 className="login-page-paragraph">
          <strong>Note:</strong> maximum count of tags per user is 50, max length of tag title is 50
        </h4>
        <img
          src="build/img/example.png"
          className="center-block example-tags img-responsive"
        />
        <div className="login-form">
          {
            !userStore || userStore && !userStore.isLoggedIn ?
              <form className="form-horizontal">
                <Button
                  bsStyle="primary"
                  className="center-block text-center"
                  onClick={this.handleLoginClick}
                >
                  Login with Github
                  <FontAwesome
                    className="login-button-icon"
                    name="github"
                  />
                </Button>
                Tell your friends:
                <ShareBlock />
              </form> :
              null
          }
        </div>
      </div>
    );
  }
});

export default LoginForm;
