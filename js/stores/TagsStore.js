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

  getTags(userID) {
    const ref = new Firebase(Config.FirebaseUrl + 'user' + userID + '/tags');
    let _this = this;
    //
    ref.on('value', function(snapshot) {
      console.log(snapshot.val());
      //
      _this.tags = snapshot.val();
      _this.trigger(_this.tags);
    }, function (errorObject) {
      console.log('The read failed: ' + errorObject.code);
    });
  },

  addTag(userID, tagName) {
    let existingTag = _.findWhere(this.tags, { 'title': tagName });
    if (!existingTag) {
      const ref = new Firebase(Config.FirebaseUrl + 'user' + userID);
      let tagsRef = ref.child('tags');
      let newTagRef = tagsRef.push();
      //
      newTagRef.set({
        title: tagName
      });
      this.getTags(userID);
    }
  }

});

export default TagsStore;
