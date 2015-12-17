'use strict';

import Reflux from 'reflux';

/**
 *  List of actions for filter optionss
 */
const FilterActions = Reflux.createActions([
  'getFilters',
  'setFilter',
  'setFilterTags',
  'loadMoreWithFilters',
  'removeTag'
]);

module.exports = FilterActions;
