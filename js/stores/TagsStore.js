'use strict';

import Reflux from 'reflux';
import request from 'superagent';
import _ from 'lodash';
//
import Config from '../config/Config';
//
import TagsActions from '../actions/TagsActions';

/**
 *  TagsStore processes tags info
 */
const TagsStore = Reflux.createStore({
  listenables: [TagsActions],
  activeTags: [],

  setActiveTags(activeTags) {
    this.activeTags = activeTags;
    this.trigger(this.activeTags);
  }

});

export default TagsStore;
