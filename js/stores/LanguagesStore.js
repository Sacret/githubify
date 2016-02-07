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
  languagesInfo: {
    languages: [],
    activeLanguages: []
  },

  setLanguages(languages) {
    this.languagesInfo.languages = languages;
    this.trigger(this.languagesInfo);
  },

  setActiveLanguages(activeLanguages) {
    this.languagesInfo.activeLanguages = activeLanguages;
    this.trigger(this.languagesInfo);
  }

});

export default LanguagesStore;
