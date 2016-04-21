'use strict';

import React from 'react';
import Reflux from 'reflux';
import Rebase from 're-base';
import moment from 'moment';
//
import { Grid, Row, Col } from 'react-bootstrap';
//
import ClearFiltersBlock from '../components/blocks/ClearFiltersBlock';
import EmptyUserBlock from '../components/blocks/EmptyUserBlock';
import FilterBlock from '../components/blocks/FilterBlock';
import LanguagesBlock from '../components/blocks/LanguagesBlock';
import LoadingBlock from '../components/blocks/LoadingBlock';
import LoginForm from '../components/blocks/LoginForm';
import ReposBlock from '../components/blocks/ReposBlock';
import SearchBlock from '../components/blocks/SearchBlock';
import TagsBlock from '../components/blocks/TagsBlock';
import UserBlock from '../components/blocks/UserBlock';
import UserMenu from '../components/menus/UserMenu';
//
import FilterActions from '../actions/FilterActions';
import ReposActions from '../actions/ReposActions';
import UserActions from '../actions/UserActions';
//
import UserStore from '../stores/UserStore';
//
import Config from '../config/Config';

const base = Rebase.createClass(Config.FirebaseUrl);

/**
 *  Main page contains tags, filters and repos
 */
const MainPage = React.createClass({

  mixins: [Reflux.connect(UserStore, 'userStore')],

  componentDidMount() {
    UserActions.isLoggedIn();
    UserActions.getUser(this.props.params.uname);
    //
    const filter = this.props.location.query.filter || 'all';
    ReposActions.getRepos(this.props.params.uname, 1, filter);
    FilterActions.getFilters();
    FilterActions.getDefaultFilters(this.props.location.query);
  },

  componentDidUpdate(prevProps, prevState) {
    const userStore = prevState.userStore;
    if (userStore && userStore.openUser && !this.state.tags) {
      const userID = userStore.openUser.id;
      this.ref = base.syncState('users/github:' + userID + '/tags', {
        context: this,
        state: 'tags',
        asArray: true
      });
    }
  },

  componentWillUnmount() {
    base.removeBinding(this.ref);
  },

  setFirebaseTagRepos(tagKey, newReposList) {
    const userStore = this.state.userStore;
    const userID = userStore.openUser.id;
    base.post('users/github:' + userID + '/tags/' + tagKey, {
      data: { repos: newReposList }
    });
  },

  setFirebaseTags(tagKey) {
    const userStore = this.state.userStore;
    const userID = userStore.openUser.id;
    base.post('users/github:' + userID + '/tags/' + tagKey, {
      data: null
    });
  },

  editTag(oldTagKey, newTagKey, tag, callback) {
    const userStore = this.state.userStore;
    const userID = userStore.openUser.id;
    base.post('users/github:' + userID + '/tags/' + newTagKey, {
      data: { repos: tag.repos },
      then() {
        base.post('users/github:' + userID + '/tags/' + oldTagKey, {
          data: null,
          then() {
            callback();
          }
        });
      }
    });
  },

  render() {
    const userStore = this.state.userStore;
    //
    return (
      <Grid fluid={true}>
        <Row>
          <Col xs={12} md={12} className="content-block">
            {
              userStore && userStore.openUser ?
              userStore.openUser.isActive ?
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
                      />
                    </div>
                  </Row>,
                  <Row className="tags-info" key="block2">
                    <div className="container">
                      <TagsBlock
                        uid={userStore.uid}
                        openUser={userStore.openUser}
                        isLoggedIn={userStore.isLoggedIn}
                        query={this.props.location.query}
                        tags={this.state.tags}
                        setFirebaseTags={this.setFirebaseTags}
                        editTag={this.editTag}
                      />
                    </div>
                  </Row>,
                  <Row className="languages-info" key="block3">
                    <div className="container">
                      <LanguagesBlock />
                    </div>
                  </Row>,
                  <Row className="filters-info" key="block4">
                    <div className="container">
                      <FilterBlock
                        uname={this.props.params.uname}
                      />
                    </div>
                  </Row>,
                  <Row className="search-info" key="block5">
                    <div className="container">
                      <SearchBlock />
                    </div>
                  </Row>,
                  <Row className="clear-info" key="block6">
                    <div className="container">
                      <ClearFiltersBlock
                        uname={this.props.params.uname}
                      />
                    </div>
                  </Row>,
                  <Row className="repos-info" key="block7">
                    <div className="container">
                      <ReposBlock
                        uid={userStore.uid}
                        openUser={userStore.openUser}
                        isLoggedIn={userStore.isLoggedIn}
                        tags={this.state.tags}
                        setFirebaseTagRepos={this.setFirebaseTagRepos}
                      />
                    </div>
                  </Row>
                ] :
                <EmptyUserBlock
                  info={userStore.info}
                  uname={this.props.params.uname}
                /> :
                <LoadingBlock />
            }
          </Col>
        </Row>
      </Grid>
    );
  }
});

export default MainPage;
