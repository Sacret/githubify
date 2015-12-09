'use strict';

import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';
//
import { Input, Button, Alert } from 'react-bootstrap';
//
import TagsActions from '../../actions/TagsActions';
//
import TagsStore from '../../stores/TagsStore';

/**
 *  TagsBlock contains list of all tags
 */
const TagsBlock = React.createClass({

  mixins: [Reflux.connect(TagsStore, 'tagsStore')],

  componentDidMount() {
    TagsActions.getTags(this.props.userID);
  },

  render() {
    let tagsStore = this.state.tagsStore;
    console.log('tagsStore', tagsStore);
    //
    let tags = 'There are no tags for now!';
    if (tagsStore) {
      tags = _.map(tagsStore, (tag, index) => {
        return (
          <span className="tag" key={'tag' + index}>{tag.title}</span>
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
