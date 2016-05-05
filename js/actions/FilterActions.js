'use strict';

import Reflux from 'reflux';

/**
 *  List of actions for filter optionss
 */
const FilterActions = Reflux.createActions([
  'getFilters',
  'getDefaultFilters',
  'setFilter',
  'setTags',
  'setTagsReposIds',
  'setLanguages',
  'setSearch',
  'setSorting',
  'setFilters',
  'setDefaultFilters'
]);

export default FilterActions;
