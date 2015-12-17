'use strict';

import React from 'react';
import Reflux from 'reflux';
//
import { Input, Button, Alert } from 'react-bootstrap';
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
    let userStore = this.state.userStore;
    console.log('userStore', userStore);
    //
    return (
      <div className="login-form">
        {
          !userStore ?
            <form className="form-horizontal">
              {
                userStore && userStore.alertType ?
                  <div className="clearfix">
                    <Alert bsStyle={userStore.alertType}>
                      {userStore.alertMessage}
                    </Alert>
                  </div> :
                  null
              }
              <Button
                bsStyle="primary"
                className="pull-right"
                onClick={this.handleLoginClick}
              >
                Login with Github
              </Button>
            </form> :
            null
        }
      </div>
    );
  }
});

export default LoginForm;
