'use strict';

import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';
//
import { Input, Button, Alert } from 'react-bootstrap';
//
import FontAwesome from 'react-fontawesome';
//
import FilterActions from '../../actions/FilterActions';
//
import ReposStore from '../../stores/ReposStore';
import LanguagesStore from '../../stores/LanguagesStore';
//
import Config from '../../config/Config';

/**
 *  LanguagesBlock contains list of all languages
 */
const LanguagesBlock = React.createClass({

  mixins: [Reflux.connect(ReposStore, 'reposStore'),
    Reflux.connect(LanguagesStore, 'languagesStore')],

  getInitialState() {
    return ({
      activeLanguages: []
    });
  },

  filterReposByLanguages(language) {
    const languageID = 'language-' + language;
    const languageSpan = document.getElementById(languageID);
    const activeLanguages = this.state.activeLanguages;
    let newActiveLanguages = [];
    //
    if (!~languageSpan.className.indexOf('active')) {
      languageSpan.className = languageSpan.className + ' active';
      newActiveLanguages = _.union(activeLanguages, [language]);
    }
    else {
      languageSpan.className = languageSpan.className.replace('active', '');
      newActiveLanguages = _.difference(activeLanguages, [language]);
    }
    //
    const reposStore = this.state.reposStore;
    const filteredReposIds = newActiveLanguages.length ?
      _.chain(reposStore.repos)
        .filter((repo) => {
          return _.includes(newActiveLanguages, repo.language);
        })
        .pluck('id')
        .value() :
      [];
    //
    FilterActions.setFilterLanguages(this.props.uname, filteredReposIds);
    //
    this.setState({
      activeLanguages: newActiveLanguages
    });
  },

  render() {
    const languagesStore = this.state.languagesStore;
    console.log('languagesStore', languagesStore);
    //
    let languages = 'There are no languages for now!';
    if (languagesStore && languagesStore.length) {
      languages = _.map(languagesStore, (language) => {
        let activeClass = _.includes(this.state.activeLanguages, language) ?
          ' active' :
          '';
        //
        return (
          <span
            className={'tag language' + activeClass}
            key={'language-' + language}
            id={'language-' + language}
            onClick={() => this.filterReposByLanguages(language)}
          >
            {language}
          </span>
        );
      });
    }
    //
    return (
      <div className="languages-block">
        {languages}
      </div>
    );
  }
});

export default LanguagesBlock;
