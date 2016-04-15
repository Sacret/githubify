'use strict';

import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';
//
import { Input, Button, Alert } from 'react-bootstrap';
import ReactFireMixin from 'reactfire';
//
import FontAwesome from 'react-fontawesome';
//
import FilterActions from '../../actions/FilterActions';
//
import ReposStore from '../../stores/ReposStore';
import FilterStore from '../../stores/FilterStore';
//
import Config from '../../config/Config';

/**
 *  TagsBlock contains list of all tags
 */
const TagsBlock = React.createClass({

  mixins: [
    Reflux.connect(ReposStore, 'reposStore'),
    Reflux.connect(FilterStore, 'filterStore'),
    ReactFireMixin
  ],

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.openUser && (!nextState || !nextState.tags)) {
      const userID = nextProps.openUser.id;
      const ref = new Firebase(Config.FirebaseUrl + 'users/github:' + userID + '/tags');
      this.bindAsArray(ref, 'tags');
    }
  },

  filterReposByTags(event, tag) {
    const filterStore = this.state.filterStore;
    let activeTags = filterStore ?
      filterStore.tags :
      [];
    //
    const openUserName = this.props.openUser.login;
    const isRemoving = ~event.target.className.indexOf('tag-remove-icon');
    if (isRemoving) {
      const userID = this.props.openUser.id;
      const itemUrl = Config.FirebaseUrl + 'users/github:' + userID + '/tags/' + tag['.key'];
      const itemRef = new Firebase(itemUrl);
      itemRef.remove();
      activeTags = _.difference(activeTags, [tag.title]);
    }
    else {
      activeTags = _.xor(activeTags, [tag.title]);
    }
    //
    const tags = this.state ? this.state.tags : null;
    const reposStore = this.state.reposStore;
    const tagReposIds = activeTags.length ?
      _(tags)
        .filter((tag) => {
          return _.includes(activeTags, tag.title);
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
    FilterActions.setTags(openUserName, activeTags, tagReposIds);
  },

  render() {
    const tagsList = this.state.tags ?
      _.sortBy(this.state.tags, 'title') :
      null;
    const filterStore = this.state.filterStore;
    //
    let tagsBlock = null;
    const isCurrentUser = this.props.openUser &&
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
        let activeClass = _.includes(filterStore.tags, tag.title) ?
          ' active' :
          '';
        //
        return (
          <span
            className={'tag' + activeClass}
            key={'tag-' + tag.title}
            onClick={(e) => this.filterReposByTags(e, tag)}
          >
            {tag.title}
            { 'github:' + this.props.openUser.id == this.props.uid ?
                <FontAwesome
                  className="tag-remove-icon"
                  name="times"
                /> :
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
