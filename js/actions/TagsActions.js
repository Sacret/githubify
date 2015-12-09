'use strict';

import Reflux from 'reflux';

/**
 *  List of actions for github user's tags
 */
const TagsActions = Reflux.createActions([
  'getTags',
  'addTag'
]);

module.exports = TagsActions;
