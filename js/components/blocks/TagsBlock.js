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

  filterReposByTags(event, tag) {
    const filterStore = this.state.filterStore;
    let activeTags = filterStore ?
      filterStore.tags :
      [];
    //
    const openUserName = this.props.openUser.login;
    const tagKey = tag.key;
    const isRemoving = ~event.target.className.indexOf('tag-remove-icon');
    if (isRemoving) {
      this.props.setFirebaseTags(tagKey);
      activeTags = _.difference(activeTags, [tagKey]);
    }
    else {
      activeTags = _.xor(activeTags, [tagKey]);
    }
    //
    const tags = this.state ? this.props.tags : null;
    const reposStore = this.state.reposStore;
    const tagReposIds = activeTags.length ?
      _(tags)
        .filter((tag) => {
          return _.includes(activeTags, tagKey);
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
        let activeClass = _.includes(filterStore.tags, tag.key) ?
          ' active' :
          '';
        //
        return (
          <span
            className={'tag' + activeClass}
            key={'tag-' + tag.key}
            onClick={(e) => this.filterReposByTags(e, tag)}
          >
            {tag.key}
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
