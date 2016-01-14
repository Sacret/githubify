'use strict';

import React from 'react';
//
import { RouteHandler } from 'react-router';

/**
 *  Layout component adds route handler to the application
 */
const Layout = React.createClass({

  render() {
    return (
      <div className="app">
        <RouteHandler />
      </div>
    );
  }
});

export default Layout;
