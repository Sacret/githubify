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
import Config from '../../config/Config';

/**
 *  TagsBlock contains list of all tags
 */
const TagsBlock = React.createClass({

  mixins: [ReactFireMixin],

  componentWillMount() {
    if (this.props.info) {
      const userID = this.props.info.uid;
      const ref = new Firebase(Config.FirebaseUrl + 'users/' + userID + '/tags');
      this.bindAsArray(ref, 'tags');
    }
  },

  filterReposByTags(event, tag) {
    const isRemoving = ~event.target.className.indexOf('tag-remove-icon');
    if (isRemoving) {
      const userID = this.props.info.uid;
      const itemUrl = Config.FirebaseUrl + 'users/' + userID + '/tags/' + tag['.key'];
      const itemRef = new Firebase(itemUrl);
      itemRef.remove();
      FilterActions.setFilterTags(this.props.accessToken, tag, false);
    }
    else {
      const tagID = 'tag-' + tag.title;
      const tagSpan = document.getElementById(tagID);
      let isTagsAdding = false;
      if (!~tagSpan.className.indexOf('active')) {
        tagSpan.className = tagSpan.className + ' active';
        isTagsAdding = true;
      }
      else {
        tagSpan.className = tagSpan.className.replace('active', '');
      }
      FilterActions.setFilterTags(this.props.accessToken, tag, isTagsAdding);
    }
  },

  render() {
    const tagsStore = this.state ? this.state.tags : null;
    console.log('tagsStore', tagsStore);
    //
    let tags = 'There are no tags for now!';
    if (tagsStore && tagsStore.length && this.props.info) {
      tags = _.map(tagsStore, (tag) => {
        return (
          <span
            className={'tag' + (tag.isLanguage ? ' language-tag' : '')}
            key={'tag-' + tag.title}
            id={'tag-' + tag.title}
            onClick={(e) => this.filterReposByTags(e, tag)}
          >
            {tag.title}
            { !tag.isLanguage && this.props.info.uid == this.props.uid ?
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
        {tags}
      </div>
    );
  }
});

export default TagsBlock;
