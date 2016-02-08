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
import LanguagesActions from '../../actions/LanguagesActions';
//
import ReposStore from '../../stores/ReposStore';
import LanguagesStore from '../../stores/LanguagesStore';
//
import Config from '../../config/Config';

/**
 *  LanguagesBlock contains list of all languages
 */
const LanguagesBlock = React.createClass({

  mixins: [
    Reflux.connect(ReposStore, 'reposStore'),
    Reflux.connect(LanguagesStore, 'languagesStore')
  ],

  filterReposByLanguages(language) {
    const languagesStore = this.state.languagesStore;
    const activeLanguages = languagesStore.activeLanguages;
    const newActiveLanguages = _.xor(activeLanguages, [language]);
    //
    const reposStore = this.state.reposStore;
    const filteredReposIds = _(reposStore.repos)
      .filter((repo) => {
        return newActiveLanguages.length ? _.includes(newActiveLanguages, repo.language) : true;
      })
      .pluck('id')
      .value();
    //
    FilterActions.setFilterLanguages(this.props.uname, filteredReposIds);
    LanguagesActions.setActiveLanguages(newActiveLanguages);
  },

  render() {
    const languagesStore = this.state.languagesStore;
    console.log('languagesStore', languagesStore);
    //
    let languages = 'There are no languages for now!';
    if (this.props.openUser && languagesStore && languagesStore.languages.length) {
      languages = _.map(languagesStore.languages, (language) => {
        let activeClass = _.includes(languagesStore.activeLanguages, language) ?
          ' active' :
          '';
        //
        return (
          <span
            className={'tag language' + activeClass}
            key={'language-' + language}
            onClick={() => this.filterReposByLanguages(language)}
          >
            {language}
          </span>
        );
      });
    }
    else if (!this.props.openUser) {
      languages = <h3 className="text-center">This github user doesn't exist</h3>;
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
