'use strict';

import React from 'react';

/**
 *  Loading block contains loading icon
 */
const LoadingBlock = React.createClass({

  render() {
    return (
      <div className="content-block">
        <img
          src="build/img/animated_loading_icon.gif"
          className="center-block loading-icon"
        />
      </div>
    );
  }
});

export default LoadingBlock;
