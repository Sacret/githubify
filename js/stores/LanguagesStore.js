'use strict';

import Reflux from 'reflux';
import request from 'superagent';
import _ from 'lodash';
//
import Config from '../config/Config';
//
import LanguagesActions from '../actions/LanguagesActions';

/**
 *  LanguagesStore processes languages info
 */
const LanguagesStore = Reflux.createStore({
  listenables: [LanguagesActions],
  languages: [],

  setLanguages(languages) {
    this.languages = languages;
    this.trigger(this.languages);
  }

});

export default LanguagesStore;
