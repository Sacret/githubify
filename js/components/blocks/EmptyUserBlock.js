'use strict';

import React from 'react';

/**
 *  Empty user block contains message and links
 */
const EmptyUserBlock = React.createClass({

  render() {
    return (
      <div className="empty-user-block">
        <div className="empty-user-block-content text-center">
          <h3>
            Github user {this.props.uname} doesn't exist
          </h3>
          { this.props.info && this.props.info.login ?
              <p>You can visit <a href={this.props.info.login}>your page</a></p> :
              <p>You can visit <a href="/">home page</a></p>
          }
        </div>
      </div>
    );
  }
});

export default EmptyUserBlock;
