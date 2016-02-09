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
import LanguagesBlock from '../components/blocks/LanguagesBlock';
import FilterBlock from '../components/blocks/FilterBlock';
import UserMenu from '../components/menus/UserMenu';
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
                  <Row className="user-info" key="block1">
                    <div className="container">
                      <Row>
                        <Col xs={6}>
                          <h2>GITHUBIFY.<span className="header-title">me</span></h2>
                        </Col>
                        <Col xs={6}>
                          <div className="pull-right logged-in-user">
                            <UserMenu
                              isLoggedIn={userStore.isLoggedIn}
                              info={userStore.info}
                            />
                          </div>
                        </Col>
                      </Row>
                      <UserBlock
                        openUser={userStore.openUser}
                        uname={this.props.params.uname}
                      />
                    </div>
                  </Row>,
                  <Row className="tags-info" key="block2">
                    <div className="container">
                      <TagsBlock
                        uid={userStore.uid}
                        openUser={userStore.openUser}
                      />
                    </div>
                  </Row>,
                  <Row className="languages-info" key="block3">
                    <div className="container">
                      <LanguagesBlock
                        openUser={userStore.openUser}
                        uname={this.props.params.uname}
                      />
                    </div>
                  </Row>,
                  <Row className="filters-info" key="block4">
                    <div className="container">
                      <FilterBlock
                        openUser={userStore.openUser}
                        uname={this.props.params.uname}
                      />
                    </div>
                  </Row>,
                  <Row className="repos-info" key="block5">
                    <div className="container">
                      <ReposBlock
                        uid={userStore.uid}
                        openUser={userStore.openUser}
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
