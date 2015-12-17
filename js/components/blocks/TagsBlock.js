'use strict';

import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';
//
import { Input, Button, Alert } from 'react-bootstrap';
import ReactFireMixin from 'reactfire';
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
    let userID = this.props.userID;
    const ref = new Firebase(Config.FirebaseUrl + 'user' + userID + '/tags');
    this.bindAsArray(ref, 'tags');
  },

  filterReposByTags(index, tag) {
    let tagSpan = document.getElementById('tag' + index);
    let isTagsAdding = false;
    if (!~tagSpan.className.indexOf('active')) {
      tagSpan.className = tagSpan.className + ' active';
      isTagsAdding = true;
    }
    else {
      tagSpan.className = tagSpan.className.replace('active', '');
    }
    FilterActions.setFilterTags(this.props.accessToken, tag, isTagsAdding);
  },

  render() {
    let tagsStore = this.state.tags;
    console.log('tagsStore', tagsStore);
    //
    let tags = 'There are no tags for now!';
    if (tagsStore) {
      tags = _.map(tagsStore, (tag, index) => {
        return (
          <span
            className="tag"
            key={'tag' + index}
            id={'tag' + index}
            onClick={() => this.filterReposByTags(index, tag)}
          >
            {tag.title}
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
