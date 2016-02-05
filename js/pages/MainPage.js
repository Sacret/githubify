'use strict';

import React from 'react';
import Reflux from 'reflux';
import { Link, hashHistory } from 'react-router';
import moment from 'moment';
//
import { Grid, Row, Col } from 'react-bootstrap';
//
import LoginForm from '../components/blocks/LoginForm';
import LoadingBlock from '../components/blocks/LoadingBlock';
import UserBlock from '../components/blocks/UserBlock';
import ReposBlock from '../components/blocks/ReposBlock';
import TagsBlock from '../components/blocks/TagsBlock';
import LanguagesBlock from '../components/blocks/LanguagesBlock';
import FilterBlock from '../components/blocks/FilterBlock';
//
import UserActions from '../actions/UserActions';
//
import UserStore from '../stores/UserStore';

/**
 *  Main page contains tags, filters and repos
 */
const MainPage = React.createClass({

  mixins: [Reflux.connect(UserStore, 'userStore')],

  componentDidMount() {
    UserActions.isLoggedIn();
  },

  handleUsernameClick() {
    const userStore = this.state.userStore;
    hashHistory.push(userStore.info.login);
  },

  handleLogoutClick() {
    UserActions.logout();
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
                [
                  <Row className="site-header" key="block0">
                    <div className="container">
                      <Col xs={6}>
                        <h2>GITHUBIFY.<span className="header-title">me</span></h2>
                      </Col>
                      <Col xs={6}>
                        <div className="pull-right logged-in-user">
                        { userStore.info ?
                            [
                              <a
                                key="user-menu-username"
                                href="#"
                                onClick={this.handleUsernameClick}
                              >
                                {userStore.info.login}
                              </a>,
                              <span
                                key="user-menu-divider"
                                className="logged-in-user-divider"
                              >
                              </span>,
                              <a
                                key="user-menu-logout"
                                href="#"
                                onClick={this.handleLogoutClick}
                              >
                                Logout
                              </a>
                            ] :
                            null
                        }
                        </div>
                      </Col>
                    </div>
                  </Row>,
                  <Row className="user-info" key="block1">
                    <div className="container">
                      <UserBlock
                        info={userStore.openUser}
                        uname={this.props.params.uname}
                      />
                    </div>
                  </Row>,
                  <Row className="tags-info" key="block2">
                    <div className="container">
                      <TagsBlock
                        uid={userStore.uid}
                        info={userStore.openUser}
                      />
                    </div>
                  </Row>,
                  <Row className="languages-info" key="block3">
                    <div className="container">
                      <LanguagesBlock uname={this.props.params.uname} />
                    </div>
                  </Row>,
                  <Row className="filters-info" key="block4">
                    <div className="container">
                      <FilterBlock uname={this.props.params.uname} />
                    </div>
                  </Row>,
                    <div className="container">
                      <ReposBlock
                        uname={this.props.params.uname}
                        userStore={userStore}
                      />
                    </div>
                  </Row>
                ] :
                null
            }
          </Col>
        </Row>
      </Grid>
    );
  }
});

export default MainPage;
