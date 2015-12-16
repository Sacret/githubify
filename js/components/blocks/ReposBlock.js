'use strict';

import React from 'react';
import ReactFireMixin from 'reactfire';
import Reflux from 'reflux';
import _ from 'lodash';
import moment from 'moment';
import createFragment from 'react-addons-create-fragment';
import Autosuggest from 'react-autosuggest'
//
import { Col, Thumbnail, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
//
import MoreButton from './MoreButton';
import InfiniteScrollMixin from '../mixins/InfiniteScrollMixin';
//
import Config from '../../config/Config';
//
import ReposActions from '../../actions/ReposActions';
//
import ReposStore from '../../stores/ReposStore';

/**
 *  ReposBlock contains authorization form
 */
const ReposBlock = React.createClass({

  mixins: [Reflux.connect(ReposStore, 'reposStore'),
    ReactFireMixin, InfiniteScrollMixin],

  getInitialState() {
    return({
      defaultValue: ' '
    });
  },

  componentDidMount() {
    ReposActions.getRepos(this.props.userStore.accessToken, 1);
  },

  componentWillMount() {
    let userID = this.props.userStore.info.id;
    const ref = new Firebase(Config.FirebaseUrl + 'user' + userID + '/tags');
    this.bindAsArray(ref, 'tags');
  },

  addTag(index, repoID) {
    let _this = this;
    let tagNames = document.getElementById('repo-tag-input-' + index).value.trim();
    let tagNamesArray = tagNames.split(',');
    //
    _.forEach(tagNamesArray, (tagName) => {
      let correctTagName = tagName.trim();
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
          placeholder: 'Type tags...',
          value: '',
          type: 'search'
        };
        //
        let button = <Button
        className="repo-add-tag-btn"
          onClick={() => this.addTag(index, repo.id)}
        >
          Add tag
        </Button>;
        //
        return (
          <Thumbnail key={'repo' + index} className="repo">
            <Col xs={9}>
              <a href={repo.html_url}>
                <p className="repo-name">{repo.name}</p>
              </a>
              { repo.description.length ?
                  <p>{repo.description}</p> :
                  null
              }
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
            <Col xs={3} className="text-right">
              <span className="repo-language">{repo.language}</span>
              <span className="repo-stars">
                <FontAwesome name="star" /> {repo.stargazers_count}
              </span>
              <span className="repo-forks">
                <FontAwesome name="code-fork" /> {repo.forks_count}
              </span>
            </Col>
          </Thumbnail>
        );
      });
      //
      nextPage = reposStore.nextPage;
      isScroll = reposStore.isScroll;
    }
    //
    return (
      <div>
        {repos}
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
