'use strict';

import Reflux from 'reflux';

/**
 *  List of actions for github user
 */
const UserActions = Reflux.createActions([
  'login',
  'isLoggedIn',
  'logout',
  'getUser'
]);

export default UserActions;
