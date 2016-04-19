'use strict';

import React from 'react';
import Reflux from 'reflux';
import Rebase from 're-base';
import _ from 'lodash';
//
import { Input, Button, Alert } from 'react-bootstrap';
//
import FontAwesome from 'react-fontawesome';
//
import FilterActions from '../../actions/FilterActions';
//
import ReposStore from '../../stores/ReposStore';
import FilterStore from '../../stores/FilterStore';
//
import Config from '../../config/Config';

const base = Rebase.createClass(Config.FirebaseUrl);

/**
 *  TagsBlock contains list of all tags
 */
const TagsBlock = React.createClass({

  mixins: [
    Reflux.connect(ReposStore, 'reposStore'),
    Reflux.connect(FilterStore, 'filterStore')
  ],

  getInitialState() {
    return({
      tagEditingKey: ''
    });
  },

  componentDidMount() {
    const userID = this.props.openUser.id;
    const query = this.props.query;
    const _this = this;
    base.listenTo('users/github:' + userID + '/tags', {
      context: this,
      asArray: true,
      then(tags) {
        if (query.tags && query.tags.length) {
          const queryTags = !_.isArray(query.tags) ? [query.tags] : query.tags;
          const tagReposIds = _this.getTagReposIds(tags, queryTags);
          FilterActions.setTagsReposIds(tagReposIds);
        }
        FilterActions.setDefaultFilters(false, true);
      }
    });
  },

  getTagReposIds(tags, activeTags) {
    const reposStore = this.state.reposStore;
    const tagReposIds = reposStore && activeTags.length ?
      _(tags)
        .filter((tag) => {
          return _.includes(activeTags, tag.key);
        })
        .map((tag) => {
          return _(tag.repos).values().pluck('id').value();
        })
        .flatten()
        .uniq()
        .value() :
      _(reposStore.repos)
        .pluck('id')
        .value();
    return tagReposIds;
  },

  filterReposByTags(event, tag) {
    const filterStore = this.state.filterStore;
    let activeTags = filterStore ?
      filterStore.tags :
      [];
    //
    const openUserName = this.props.openUser.login;
    const tagKey = tag.key;
    const targetClassName = event.target.className;
    const isRemoving = ~targetClassName.indexOf('tag-remove-icon');
    const isEditing = ~targetClassName.indexOf('tag-edit-icon');
    if (~targetClassName.indexOf('tag-edit-input')) {
      return;
    }
    if (isRemoving) {
      this.props.setFirebaseTags(tagKey);
      activeTags = _.difference(activeTags, [tagKey]);
    }
    else if (isEditing) {
      this.setState({
        tagEditingKey: tag.key
      });
    }
    else {
      activeTags = _.xor(activeTags, [tagKey]);
    }
    //
    if (!isEditing) {
      const tagReposIds = this.getTagReposIds(this.props.tags, activeTags);
      FilterActions.setTagsReposIds(tagReposIds);
      FilterActions.setTags(activeTags);
    }
  },

  handleKeyUp(e) {
    if (e.keyCode == 13) {
      this.submitTagEdit();
    }
  },

  submitTagEdit() {
    this.props.editTag(this.state.tagEditingKey, this.refs.inputTagEdit.getValue().trim());
  },

  render() {
    const tagsList = this.props.tags ?
      _.sortBy(this.props.tags, 'key') :
      null;
    const filterStore = this.state.filterStore;
    //
    let tagsBlock = null;
    const isCurrentUser = this.props.isLoggedIn && this.props.openUser &&
      ('github:' + this.props.openUser.id == this.props.uid);
    const isTagsListEmpty = tagsList && !tagsList.length;
    if (isCurrentUser && isTagsListEmpty) {
      tagsBlock = <p>You don't have any tags yet. Fell free to add them</p>;
    }
    else if (!isCurrentUser && isTagsListEmpty) {
      tagsBlock = <p>
        Unfortunately this user doesn't have any tags on githubify.
        { this.props.openUser.email ?
            <span>&nbsp;Let him/her know about it on email:&nbsp;
              <a
                href={'mailto:' + this.props.openUser.email + '?subject=githubify.me'}
              >
                {this.props.openUser.email}
              </a>
            </span> :
            null
        }
      </p>;
    }
    if (tagsList && tagsList.length && this.props.openUser) {
      tagsBlock = _.map(tagsList, (tag) => {
        let activeClass = filterStore && _.includes(filterStore.tags, tag.key) ?
          ' active' :
          '';
        let editingClass = (this.state.tagEditingKey === tag.key) ?
          ' active editing-tag' :
          '';
        //
        return (
          <span
            className={'tag' + activeClass + editingClass}
            key={'tag-' + tag.key}
            onClick={(e) => this.filterReposByTags(e, tag)}
          >
            { this.state.tagEditingKey !== tag.key ?
                tag.key :
                <Input
                  type="text"
                  ref="inputTagEdit"
                  defaultValue={tag.key}
                  className="tag-edit-input"
                  onKeyUp={(e) => this.handleKeyUp(e)}
                />
            }
            { isCurrentUser ?
                [
                  <FontAwesome
                    key="tag-remove-icon"
                    className="tag-icon tag-remove-icon"
                    name="times"
                    title="Remove tag"
                  />,
                  <FontAwesome
                    key="tag-edit-icon"
                    className="tag-icon tag-edit-icon"
                    name="pencil"
                    title="Edit tag"
                  />
                ]:
                null
            }
          </span>
        );
      });
    }
    //
    return (
      <div className="tags-block">
        {tagsBlock}
      </div>
    );
  }
});

export default TagsBlock;
