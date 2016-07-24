'use strict';

import React from 'react';
//
import { Input } from 'react-bootstrap';
//
import FilterActions from '../../actions/FilterActions';

/**
 *  Sorting block displays select element for sorting
 */
const SortingBlock = React.createClass({

  handleSortSelect() {
    const sort = this.refs.sort.getValue();
    let sorting = {};
    switch(sort) {
      case 'titleAsc':
        sorting = {
          sort: 'name',
          direction: 'asc'
        };
        break;
      case 'titleDesc':
        sorting =  {
          sort: 'name',
          direction: 'desc'
        };
        break;
      case 'createdAsc':
        sorting =  {
          sort: 'created_at',
          direction: 'asc'
        };
        break;
      case 'createdDesc':
        sorting =  {
          sort: 'created_at',
          direction: 'desc'
        };
        break;
      case 'updatedAsc':
        sorting =  {
          sort: 'updated_at',
          direction: 'asc'
        };
        break;
      case 'updatedDesc':
        sorting =  {
          sort: 'updated_at',
          direction: 'desc'
        };
        break;
      case 'starsAsc':
        sorting =  {
          sort: 'stargazers_count',
          direction: 'asc'
        };
        break;
      case 'starsDesc':
        sorting =  {
          sort: 'stargazers_count',
          direction: 'desc'
        };
        break;
    }
    FilterActions.setSorting(sorting);
  },

  render() {
    return (
      <form className="repos-block-sort-input">
        <Input
          type="select"
          placeholder="Sort by"
          ref="sort"
          onChange={this.handleSortSelect}
        >
          <option value="titleAsc">Title (asc)</option>
          <option value="titleDesc">Title (desc)</option>
          <option value="createdAsc">Created date (asc)</option>
          <option value="createdDesc">Created date (desc)</option>
          <option value="updatedAsc">Updated date (asc)</option>
          <option value="updatedDesc">Updated date (desc)</option>
          <option value="starsAsc">Stars (asc)</option>
          <option value="starsDesc">Stars (desc)</option>
        </Input>
      </form>
    );
  }
});

export default SortingBlock;
