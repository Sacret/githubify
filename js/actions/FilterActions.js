'use strict';

import Reflux from 'reflux';

/**
 *  List of actions for filter optionss
 */
const FilterActions = Reflux.createActions([
  'getFilters',
  'setFilter',
  'setTags',
  'setLanguages',
  'setSearch'
]);

export default FilterActions;
