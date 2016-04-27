'use strict';

import React from 'react';
import Reflux from 'reflux';
import Rebase from 're-base';
import _ from 'lodash';
import moment from 'moment';
import createFragment from 'react-addons-create-fragment';
import { Typeahead } from 'react-typeahead';
import Highlight from 'react-highlighter';
//
import { Row, Col, Thumbnail, Button, FormGroup, FormControl } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import MasonryMixin from 'react-masonry-mixin';
//
import ReposActions from '../../actions/ReposActions';
import UserActions from '../../actions/UserActions';
//
import ReposStore from '../../stores/ReposStore';
import FilterStore from '../../stores/FilterStore';
//
import Config from '../../config/Config';
//
import History from '../../history/History';

const base = Rebase.createClass(Config.FirebaseUrl);

const masonryOptions = {
  transitionDuration: 0
};

/**
 *  ReposBlock contains authorization form
 */
const ReposBlock = React.createClass({

  mixins: [
    Reflux.connect(ReposStore, 'reposStore'),
    Reflux.connect(FilterStore, 'filterStore'),
    MasonryMixin(React)('masonryContainer', masonryOptions)
  ],

  addTag(tagName, repoID) {
    const userID = this.props.openUser.id;
    const newTag = base.push('users/github:' + userID + '/tags/' + tagName + '/repos', {
      data: {
        id: repoID
      }
    });
  },

  addRepoTag(index, repo) {
    const tagsStore = this.props.tags;
    if (tagsStore.length < 30) {
      const _this = this;
      const tagNames = _this.refs['typeahead' + index].refs.entry.value.trim();
      const tagNamesArray = tagNames.split(',');
      //
      _.forEach(tagNamesArray, (tagName) => {
        let correctTagName = _.trunc(tagName.trim(), {
          length: 50,
          omission: ''
        });
        if (correctTagName.length && !_.includes(repo.tags, correctTagName)) {
          _this.addTag(correctTagName.replace(/<|>/g, ''), repo.id);
        }
      });
      //
      _this.typeaheadBlur(null, index, true);
    }
    else {

    }
  },

  removeRepoTag(tagKey, tagRepos, repoID) {
    const tagIndex = _.findIndex(this.props.tags, (tag) => {
      return tag.key == tagKey;
    });
    const repoKey = _.findKey(tagRepos, (tagRepo) => {
      return tagRepo.id == repoID;
    });
    if (tagKey && repoKey) {
      const newList = _.reject(this.props.tags[tagIndex].repos, { id: repoID });
      this.props.setFirebaseTagRepos(tagKey, newList);
    }
  },

  getSuggestions() {
    const tagsStore = this.props.tags;
    const suburbs = _.map(tagsStore, (tag) => {
      return tag.key;
    });
    return suburbs;
  },

  typeaheadKeyUp(e, index, repo) {
    if (e.keyCode == 13) {
      this.addRepoTag(index, repo);
    }
  },

  typeaheadBlur(e, index, isSetEmpty) {
    if (!(e && e.relatedTarget && e.relatedTarget.className == 'typeahead-option')) {
      const newState = {
        selection: null,
        selectionIndex: null,
        visible: []
      };
      if (isSetEmpty) {
        newState.entryValue = '';
      }
      this.refs['typeahead' + index].setState(newState);
    }
  },

  handleUsernameClick(username) {
    History.pushState(null, username);
  },

  render() {
    const reposStore = this.state.reposStore;
    const reposLength = reposStore ? reposStore.filteredRepos.length : 0;
    const tagsStore = this.props.tags;
    //
    let reposBlock = null;
    if (reposStore && this.props.openUser) {
      const isCurrentUser = this.props.isLoggedIn &&
        ('github:' + this.props.openUser.id == this.props.uid);
      reposBlock = _.map(reposStore.filteredRepos, (repo, index) => {
        let fragmentTags = {};
        if (tagsStore) {
          let tags = _.filter(tagsStore, (tag) => {
            return _.find(tag.repos, {id: repo.id});
          });
          let sortedTags = _.sortBy(tags, 'key');
          let appliedTags = [];
          _.forEach(sortedTags, (tag, tagIndex) => {
            appliedTags.push(tag.key);
            fragmentTags['repo-' + repo.id + '-tags-' + tagIndex] =
              <span
                className="repo-tag"
                key={'repo-' + repo.id + '-tags-' + tagIndex}
              >
                {tag.key}
                { isCurrentUser ?
                    <FontAwesome
                      className="tag-icon tag-remove-icon"
                      name="times"
                      onClick={() => this.removeRepoTag(tag.key, tag.repos, repo.id)}
                    /> :
                    null
                }
              </span>;
          });
          repo.tags = appliedTags;
        }
        if (repo.language && repo.language.length) {
          fragmentTags['repo-tags-language'] =
            <span
              className="repo-tag repo-language-tag"
              key={'repo-tags-language-' + index}
            >
              {repo.language}
            </span>;
        }
        let tagsBlock = createFragment(fragmentTags);
        //
        let options = this.getSuggestions();
        let inputProps = {
          ref: 'repoTagInput'
        };
        let typeaheadRef = 'typeahead' + index;
        //
        const searchStr = this.state.filterStore ?
          this.state.filterStore.searchStr :
          '';
        //
        return (
          <Col xs={12} md={4} key={'repo' + index}>
            <Thumbnail className="repo">
              <Col xs={12}>
                <a href={repo.html_url} target="_blank">
                  <p className="repo-name">
                    <Highlight search={searchStr}>
                      {repo.name}
                    </Highlight>
                  </p>
                </a>
                { reposStore.isShowingOwner ?
                    <p className="repo-owner">
                      by <a
                        href="#"
                        className="repo-owner-name"
                        onClick={() => this.handleUsernameClick(repo.owner.login)}
                      >
                        {repo.owner.login}
                      </a>
                    </p> :
                    null
                }
                <small className="repo-updated">
                  Updated on {moment(repo.updated_at).format('MMM D, YYYY')}
                </small>
                <div className="clearfix">
                  {tagsBlock}
                </div>
                { isCurrentUser ?
                    <div className="repo-form" key={'repo-form-' + index}>
                      <Typeahead
                        options={options}
                        ref={typeaheadRef}
                        maxVisible={5}
                        placeholder="Type comma-separated tags"
                        onKeyUp={(e) => this.typeaheadKeyUp(e, index, repo)}
                        onOptionSelected={() => this.addRepoTag(index, repo)}
                        onBlur={(e) => this.typeaheadBlur(e, index)}
                      />
                    </div> :
                    null
                }
              </Col>
            </Thumbnail>
          </Col>
        );
      });
    }
    //
    return (
      <div>
        <Row key="repos-top-block">
          <Col xs={9} key="repos-top-block-count">
            <p>{reposLength} repo{reposLength !== 1 ? 's' : ''}</p>
          </Col>
          <Col xs={3} key="repos-top-block-select">
            <form>
              <FormGroup controlId="formControlsSelect">
                <FormControl componentClass="select" placeholder="Sort by">
                  <option value="date">Updated date</option>
                  <option value="title">Title</option>
                  <option value="star">Stars</option>
                </FormControl>
              </FormGroup>
            </form>
          </Col>
        </Row>
        <Row ref="masonryContainer">
          {reposBlock}
        </Row>
      </div>
    );
  }
});

export default ReposBlock;
