'use strict';

import React from 'react';
import ReactFireMixin from 'reactfire';
import Reflux from 'reflux';
import _ from 'lodash';
import moment from 'moment';
import createFragment from 'react-addons-create-fragment';
import { Typeahead } from 'react-typeahead';
import Highlight from 'react-highlighter';
//
import { Row, Col, Thumbnail, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import MasonryMixin from 'react-masonry-mixin';
//
import Config from '../../config/Config';
//
import ReposActions from '../../actions/ReposActions';
import UserActions from '../../actions/UserActions';
//
import ReposStore from '../../stores/ReposStore';
import FilterStore from '../../stores/FilterStore';
//
import History from '../../history/History';

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
    ReactFireMixin,
    MasonryMixin(React)('masonryContainer', masonryOptions)
  ],

  componentWillUpdate(nextProps, nextState) {
    const _this = this;
    if (this.props.openUser && !nextState.tags) {
      const userID = this.props.openUser.id;
      const ref = new Firebase(Config.FirebaseUrl + 'users/github:' + userID + '/tags');
      this.bindAsArray(ref, 'tags');
    }
  },

  addTag(tagName, repoID) {
    if (tagName.length) {
      let existingTag = _.findWhere(this.state.tags, { 'title': tagName });
      if (!existingTag) {
        this.firebaseRefs.tags.push({
          title: tagName
        });
        existingTag = _.findWhere(this.state.tags, { 'title': tagName });
      }
      //
      const existingRepo = _.findWhere(existingTag.repos, { 'id': repoID });
      if (!existingRepo) {
        this.firebaseRefs.tags.child(existingTag['.key']).child('repos').push({
          id: repoID
        });
      }
    }
  },

  addRepoTag(index, repoID) {
    const tagsStore = this.state.tags;
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
        _this.addTag(correctTagName.replace(/<|>/g, ''), repoID);
      });
      //
      _this.typeaheadBlur(null, index, true);
    }
    else {

    }
  },

  removeRepoTag(tagKey, tagRepos, repoID) {
    const repoKey = _.findKey(tagRepos, (tagRepo) => {
      return tagRepo.id == repoID;
    });
    if (tagKey && repoKey) {
      const userID = this.props.openUser.id;
      const itemUrl = Config.FirebaseUrl + 'users/github:' + userID + '/tags/' + tagKey + '/repos/' + repoKey;
      const itemRef = new Firebase(itemUrl);
      itemRef.remove();
    }
  },

  getSuggestions() {
    const tagsStore = this.state.tags;
    const suburbs = _.map(tagsStore, (tag) => {
      return tag.title;
    });
    return suburbs;
  },

  typeaheadKeyUp(e, index, repoID) {
    if (e.keyCode == 13) {
      this.addRepoTag(index, repoID);
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
    console.log('reposStore', reposStore);
    const tagsStore = this.state.tags;
    const reposLength = reposStore ? reposStore.filteredRepos.length : 0;
    //
    let repos = null;
    if (reposStore && this.props.openUser) {
      repos = _.map(reposStore.filteredRepos, (repo, index) => {
        let tags = _.filter(tagsStore, (tag) => {
          return _.find(tag.repos, {id: repo.id});
        });
        let sortedTags = _.sortBy(tags, 'title');
        let fragmentTags = {};
        _.forEach(sortedTags, (tag, tagIndex) => {
          fragmentTags['repo-tags-' + tagIndex] =
            <span
              className="repo-tag"
              key={'repo-tags-' + tagIndex}
            >
              {tag.title}
              { 'github:' + this.props.openUser.id == this.props.uid ?
                  <FontAwesome
                    className="tag-remove-icon"
                    name="times"
                    onClick={() => this.removeRepoTag(tag['.key'], tag.repos, repo.id)}
                  /> :
                  null
              }
            </span>;
        });
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
          <Col xs={6} md={4} key={'repo' + index}>
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
                { 'github:' + this.props.openUser.id == this.props.uid ?
                    [
                      <div className="repo-form" key={'repo-form-' + index}>
                        <Typeahead
                          options={options}
                          ref={typeaheadRef}
                          maxVisible={5}
                          onKeyUp={(e) => this.typeaheadKeyUp(e, index, repo.id)}
                          onOptionSelected={() => this.addRepoTag(index, repo.id)}
                          onBlur={(e) => this.typeaheadBlur(e, index)}
                        />
                      </div>,
                      <small className="repo-tags-tip" key={'repo-tags-tip-' + index}>
                        Type one or several tags (divided by comma)
                      </small>
                    ] :
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
        <p>{reposLength} repo{reposLength !== 1 ? 's' : ''}</p>
        <Row ref="masonryContainer">
          {repos}
        </Row>
      </div>
    );
  }
});

export default ReposBlock;
