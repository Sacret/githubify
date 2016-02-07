'use strict';

import Reflux from 'reflux';

/**
 *  List of actions for github user's repos languages
 */
const LanguagesActions = Reflux.createActions([
  'setLanguages',
  'setActiveLanguages'
]);

export default LanguagesActions;
