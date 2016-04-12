'use strict';

import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';
//
import { Grid, Row, Col } from 'react-bootstrap';
import { Input, Button, Glyphicon } from 'react-bootstrap';
//
import FilterActions from '../../actions/FilterActions';
//
import FilterStore from '../../stores/FilterStore';

/**
 *  SearchBlock contains list of all filters
 */
const SearchBlock = React.createClass({

  mixins: [Reflux.connect(FilterStore, 'filterStore')],

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  },

  handleChange() {
    const searchStr = this.refs.search.getValue().trim();
    FilterActions.setSearch(this.props.uname, searchStr);
  },

  clearSearch() {
    FilterActions.setSearch(this.props.uname, '');
  },

  render() {
    const innerButton = <Button>
      <Glyphicon glyph="search" />
    </Button>;
    const searchStr = this.state.filterStore ?
      this.state.filterStore.searchStr :
      '';
    //
    return (
      <Grid>
        <Row>
          <Col md={4} xs={12}>
            <div className="search-block">
              <form className="form-horizontal">
                <Input
                  type="text"
                  ref="search"
                  value={searchStr}
                  buttonAfter={innerButton}
                  onKeyPress={(e) => this.handleKeyPress(e)}
                  onChange={this.handleChange}
                />
                { searchStr.length ?
                  <Glyphicon
                    glyph="remove-circle"
                    className="search-form-clear-icon"
                    aria-hidden="true"
                    onClick={this.clearSearch}
                  /> :
                  null
                }
              </form>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
});

export default SearchBlock;
