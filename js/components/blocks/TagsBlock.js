'use strict';

import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';
//
import { Input, Button, Alert } from 'react-bootstrap';
import ReactFireMixin from 'reactfire';
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

  render() {
    let tagsStore = this.state.tags;
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
