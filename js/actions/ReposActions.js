'use strict';

import Reflux from 'reflux';

/**
 *  List of actions for github user's repos
 */
const ReposActions = Reflux.createActions([
  'getRepos',
  'getStars',
  'setTag',
  'removeRepoTag'
]);

module.exports = ReposActions;
