'use strict';

import React from 'react';
import ReactFireMixin from 'reactfire';
import Reflux from 'reflux';
import _ from 'lodash';
import moment from 'moment';
import createFragment from 'react-addons-create-fragment';
import Autosuggest from 'react-autosuggest'
//
import { Row, Col, Thumbnail, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import MasonryMixin from 'react-masonry-mixin';
//
import MoreButton from './MoreButton';
import InfiniteScrollMixin from '../mixins/InfiniteScrollMixin';
//
import Config from '../../config/Config';
//
import ReposActions from '../../actions/ReposActions';
//
import ReposStore from '../../stores/ReposStore';

const masonryOptions = {
  transitionDuration: 0
};

/**
 *  ReposBlock contains authorization form
 */
const ReposBlock = React.createClass({

  mixins: [Reflux.connect(ReposStore, 'reposStore'), ReactFireMixin,
    InfiniteScrollMixin, MasonryMixin(React)('masonryContainer', masonryOptions)],

  getInitialState() {
    return({
      defaultValue: ' '
    });
  },

  componentDidMount() {
    ReposActions.getRepos(this.props.userStore.accessToken, 1, 'all');
  },

  componentWillMount() {
    let userID = this.props.userStore.uid;
    const ref = new Firebase(Config.FirebaseUrl + 'users/' + userID + '/tags');
    this.bindAsArray(ref, 'tags');
  },

  addTag(index, repoID) {
    let tagsStore = this.state.tags;
    if (tagsStore.length < 30) {
      let _this = this;
      let tagNames = document.getElementById('repo-tag-input-' + index).value.trim();
      let tagNamesArray = tagNames.split(',');
      //
      _.forEach(tagNamesArray, (tagName) => {
        let correctTagName = _.trunc(tagName.trim(), {
          length: 50,
          omission: ''
        });
        if (correctTagName.length) {
          let existingTag = _.findWhere(this.state.tags, {'title': correctTagName});
          if (!existingTag) {
            _this.firebaseRefs.tags.push({
              title: correctTagName
            });
          }
          existingTag = _.findWhere(this.state.tags, {'title': correctTagName});
          _this.firebaseRefs.tags.child(existingTag['.key']).child('repos').push({
            id: repoID
          });
        }
      });
      //
      document.getElementById('repo-tag-input-' + index).value = '';
    }
    else {

    }
  },

  getSuggestions(input, callback) {
    let tagsStore = this.state.tags;
    let suburbs = _.map(tagsStore, (tag) => {
      return tag.title;
    });
    let regex = new RegExp('^' + input.trim(), 'i');
    let suggestions = suburbs.filter(suburb => regex.test(suburb));
    callback(null, suggestions)
  },

  render() {
    let reposStore = this.state.reposStore;
    console.log('reposStore', reposStore);
    let tagsStore = this.state.tags;
    //
    let repos = null;
    let nextPage = null, isScroll = false;
    if (reposStore) {
      repos = _.map(reposStore.repos, (repo, index) => {
        let tags = _.filter(tagsStore, (tag) => {
          return _.find(tag.repos, {id: repo.id});
        });
        let fragmentTags = {};
        _.forEach(tags, (tag, index) => {
          fragmentTags['repo-tags-' + index] =
            <span className="repo-tag">{tag.title}</span>;
        });
        let tagsBlock = createFragment(fragmentTags);
        //
        let inputAttributes = {
          id: 'repo-tag-input-' + index,
          key: 'repo-tag-input-key-' + index,
          value: '',
          type: 'search'
        };
        //
        let button = <Button
        className="repo-add-tag-btn"
          onClick={() => this.addTag(index, repo.id)}
        >
          Add
        </Button>;
        //
        return (
          <Col xs={6} md={4}>
            <Thumbnail key={'repo' + index} className="repo">
              <Col xs={12}>
                <a href={repo.html_url}>
                  <p className="repo-name">{repo.name}</p>
                </a>
                <small className="repo-updated">
                  Updated on {moment(repo.updated_at).format('MMM D, YYYY')}
                </small>
                <div className="clearfix">
                  {tagsBlock}
                </div>
                <div className="repo-form">
                  <Autosuggest
                    id={'repo-autosuggest-' + index}
                    value={this.state.defaultValue}
                    suggestions={this.getSuggestions}
                    inputAttributes={inputAttributes}
                  />
                  {button}
                </div>
                <small className="repo-tags-tip">
                  Type one or several tags (divided by comma)
                </small>
              </Col>
            </Thumbnail>
          </Col>
        );
      });
      //
      nextPage = reposStore.nextPage;
      isScroll = reposStore.isScroll;
    }
    //
    return (
      <div>
        <Row ref="masonryContainer">
          {repos}
        </Row>
        <MoreButton
          nextPage={nextPage}
          isScroll={isScroll}
          accessToken={this.props.userStore.accessToken}
        />
      </div>
    );
  }
});

export default ReposBlock;
