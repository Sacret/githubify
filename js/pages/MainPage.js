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

/**
 *  Main page contains sidebar, topnavbar and map
 */
const MainPage = React.createClass({

  mixins: [Reflux.connect(UserStore, 'userStore')],

  componentDidMount() {
    UserActions.isLoggedIn();
  },

  render() {
    let userStore = this.state.userStore;
    console.log('userStore', userStore);
    //
    return (
      <Grid fluid={true}>
        <Row>
          <Col xs={12} md={12} className="content-block">
            {
              userStore ?
              userStore.isLoggedIn ?
              [
                <Row className="user-info">
                  <div className="container">
                    <h2>GITHUBIFY.<span className="header-title">me</span></h2>
                    <UserBlock info={userStore.info} />
                  </div>
                </Row>,
                <Row className="tags-info">
                  <div className="container">
                    <TagsBlock />
                  </div>
                </Row>,
                <Row className="filters-info">
                  <div className="container">
                    <FilterBlock />
                  </div>
                </Row>,
                <Row className="repos-info">
                  <div className="container">
                    <ReposBlock accessToken={userStore.accessToken} />
                  </div>
                </Row>
              ] :
              <LoginForm /> :
              <LoadingBlock />
            }
          </Col>
        </Row>
      </Grid>
    );
  }
});

export default MainPage;
