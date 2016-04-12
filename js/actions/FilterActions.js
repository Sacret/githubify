'use strict';

import Reflux from 'reflux';

/**
 *  List of actions for filter optionss
 */
const FilterActions = Reflux.createActions([
  'getFilters',
  'setFilter',
  'setFilterTags',
  'setFilterLanguages',
  'setSearch',
  'clearFilters'
]);

export default FilterActions;
