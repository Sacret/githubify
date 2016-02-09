'use strict';

import React from 'react';
import Reflux from 'reflux';
import moment from 'moment';
//
import { Grid, Row, Col } from 'react-bootstrap';
//
import LoginForm from '../components/blocks/LoginForm';
import LoadingBlock from '../components/blocks/LoadingBlock';
import UserBlock from '../components/blocks/UserBlock';
import ReposBlock from '../components/blocks/ReposBlock';
import TagsBlock from '../components/blocks/TagsBlock';
import FilterBlock from '../components/blocks/FilterBlock';
//
import UserActions from '../actions/UserActions';
//
import UserStore from '../stores/UserStore';
//
import History from '../history/History';

/**
 *  Login page contains login form
 */
const LoginPage = React.createClass({

  mixins: [Reflux.connect(UserStore, 'userStore')],

  componentDidMount() {
    UserActions.isLoggedIn();
  },

  componentWillUpdate(nextProps, nextState) {
    if (nextState.userStore && nextState.userStore.isLoggedIn) {
      History.pushState(null, nextState.userStore.info.login);
    }
  },

  render() {
    const userStore = this.state.userStore;
    console.log('userStore', userStore);
    //
    return (
      <Grid fluid={true}>
        <Row>
          <Col xs={12} md={12} className="content-block">
            {
              userStore ?
                <LoginForm /> :
                <LoadingBlock />
            }
          </Col>
        </Row>
      </Grid>
    );
  }
});

export default LoginPage;
