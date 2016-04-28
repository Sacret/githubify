'use strict';

import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';
//
import { Button, Alert } from 'react-bootstrap';
//
import FontAwesome from 'react-fontawesome';
//
import FilterActions from '../../actions/FilterActions';
//
import ReposStore from '../../stores/ReposStore';
import FilterStore from '../../stores/FilterStore';
//
import Config from '../../config/Config';

/**
 *  LanguagesBlock contains list of all languages
 */
const LanguagesBlock = React.createClass({

  mixins: [
    Reflux.connect(ReposStore, 'reposStore'),
    Reflux.connect(FilterStore, 'filterStore')
  ],

  filterReposByLanguages(language) {
    const filterStore = this.state.filterStore;
    const activeLanguages = _.xor(filterStore.languages, [language]);
    FilterActions.setLanguages(activeLanguages);
  },

  render() {
    const reposStore = this.state.reposStore;
    const filterStore = this.state.filterStore;
    //
    let languagesBlock = <p>There are no languages for now!</p>;
    if (reposStore) {
      const sortedLanguages = _.sortBy(reposStore.languages);
      languagesBlock = _.map(sortedLanguages, (language) => {
        let activeClass = filterStore && _.includes(filterStore.languages, language) ?
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
    //
    return (
      <div className="languages-block">
        {languagesBlock}
      </div>
    );
  }
});

export default LanguagesBlock;
