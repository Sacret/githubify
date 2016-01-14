'use strict';

import React from 'react';
import ReactFireMixin from 'reactfire';
import Reflux from 'reflux';
import _ from 'lodash';
import moment from 'moment';
import createFragment from 'react-addons-create-fragment';
import { Typeahead } from 'react-typeahead';
//
import { Row, Col, Thumbnail, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import MasonryMixin from 'react-masonry-mixin';
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
    MasonryMixin(React)('masonryContainer', masonryOptions)],

  componentDidMount() {
    ReposActions.getRepos(this.props.userStore.accessToken, 1, 'all');
  },

  componentWillMount() {
    const userID = this.props.userStore.uid;
    const ref = new Firebase(Config.FirebaseUrl + 'users/' + userID + '/tags');
    this.bindAsArray(ref, 'tags');
  },

  componentWillUpdate(nextProps, nextState) {
    const _this = this;
    if (nextState.reposStore) {
      let repoIds = [];
      _.forEach(nextState.reposStore.repos, (repo) => {
        let isInclude = _.includes(JSON.parse(localStorage.getItem('languagesRepoIDs')), repo.id);
        if (repo.language && !isInclude) {
          _this.addTag(repo.language, repo.id, true);
          repoIds.push(repo.id);
        }
      });
      if (repoIds.length) {
        let allRepoIds = _.union(JSON.parse(localStorage.getItem('languagesRepoIDs')), repoIds);
        localStorage.setItem('languagesRepoIDs', JSON.stringify(allRepoIds));
      }
    }
  },

  addTag(tagName, repoID, isLanguage) {
    if (tagName.length) {
      let existingTag = _.findWhere(this.state.tags, { 'title': tagName });
      if (!existingTag) {
        this.firebaseRefs.tags.push({
          title: tagName,
          isLanguage: !!isLanguage
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
        _this.addTag(correctTagName, repoID);
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
      const userID = this.props.userStore.uid;
      const itemUrl = Config.FirebaseUrl + 'users/' + userID + '/tags/' + tagKey + '/repos/' + repoKey;
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

  render() {
    const reposStore = this.state.reposStore;
    console.log('reposStore', reposStore);
    const tagsStore = this.state.tags;
    //
    let repos = null;
    if (reposStore) {
      repos = _.map(reposStore.repos, (repo, index) => {
        let tags = _.filter(tagsStore, (tag) => {
          return _.find(tag.repos, {id: repo.id});
        });
        let fragmentTags = {};
        _.forEach(tags, (tag, index) => {
          fragmentTags['repo-tags-' + index] =
            <span
              className={'repo-tag' + (tag.isLanguage ? ' repo-language-tag' : '')}
              key={'repo-tags-' + index}
            >
              {tag.title}
              { !tag.isLanguage ?
                  <FontAwesome
                    className="tag-remove-icon"
                    name="times"
                    onClick={() => this.removeRepoTag(tag['.key'], tag.repos, repo.id)}
                  /> :
                  null
              }
            </span>;
        });
        let tagsBlock = createFragment(fragmentTags);
        //
        let options = this.getSuggestions();
        let inputProps = {
          ref: 'repoTagInput'
        };
        let typeaheadRef = 'typeahead' + index;
        //
        return (
          <Col xs={6} md={4} key={'repo' + index}>
            <Thumbnail className="repo">
              <Col xs={12}>
                <a href={repo.html_url}>
                  <p className="repo-name">{repo.name}</p>
                </a>
                { reposStore.isShowingOwner ?
                    <p className="repo-owner">
                      by <a href={repo.owner.html_url}>{repo.owner.login}</a>
                    </p> :
                    null
                }
                <small className="repo-updated">
                  Updated on {moment(repo.updated_at).format('MMM D, YYYY')}
                </small>
                <div className="clearfix">
                  {tagsBlock}
                </div>
                <div className="repo-form">
                  <Typeahead
                    options={options}
                    ref={typeaheadRef}
                    maxVisible={5}
                    onKeyUp={(e) => this.typeaheadKeyUp(e, index, repo.id)}
                    onOptionSelected={() => this.addTag(index, repo.id)}
                    onBlur={(e) => this.typeaheadBlur(e, index)}
                  />
                </div>
                <small className="repo-tags-tip">
                  Type one or several tags (divided by comma)
                </small>
              </Col>
            </Thumbnail>
          </Col>
        );
      });
    }
    //
    return (
      <Row ref="masonryContainer">
        {repos}
      </Row>
    );
  }
});

export default ReposBlock;
