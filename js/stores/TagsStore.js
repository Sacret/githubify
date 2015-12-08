'use strict';

import Reflux from 'reflux';
import request from 'superagent';
import _ from 'lodash';
//
import Config from '../config/Config';
//
import TagsActions from '../actions/TagsActions';

/**
 *  TagsStore processes repos info
 */
const TagsStore = Reflux.createStore({
  listenables: [TagsActions],
  tags: [],

  getTags() {
    this.tags = ['one', 'two', 'three'];
    this.trigger(this.tags);
  }

});

export default TagsStore;
