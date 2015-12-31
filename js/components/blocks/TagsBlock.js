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
    let userID = this.props.uid;
    const ref = new Firebase(Config.FirebaseUrl + 'users/' + userID + '/tags');
    this.bindAsArray(ref, 'tags');
  },

  filterReposByTags(event, index, tag) {
    let isRemoving = ~event.target.className.indexOf('tag-remove-icon');
    if (isRemoving) {
      let userID = this.props.uid;
      let itemUrl = Config.FirebaseUrl + 'users/' + userID + '/tags/' + tag['.key'];
      let itemRef = new Firebase(itemUrl);
      itemRef.remove();
      FilterActions.setFilterTags(this.props.accessToken, tag, false);
    }
    else {
      let tagID = 'tag-' + tag.title.toLowerCase() + index;
      let tagSpan = document.getElementById(tagID);
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
    let tagsStore = this.state.tags;
    console.log('tagsStore', tagsStore);
    //
    let tags = 'There are no tags for now!';
    if (tagsStore && tagsStore.length) {
      tags = _.map(tagsStore, (tag, index) => {
        return (
          <span
            className="tag"
            key={'tag-' + tag.title.toLowerCase() + index}
            id={'tag-' + tag.title.toLowerCase() + index}
            onClick={(e) => this.filterReposByTags(e, index, tag)}
          >
            {tag.title}
            <FontAwesome
              className="tag-remove-icon"
              name="times"
            />
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
