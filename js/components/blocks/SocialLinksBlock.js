'use strict';

import React from 'react';
//
import FontAwesome from 'react-fontawesome';

/**
 *  Social links block contains github and twitter links
 */
const SocialLinksBlock = React.createClass({

  render() {
    return (
      <div className="social-links-block">
        <div className="clearfix">
          <a
            href="https://twitter.com/Githubifyme"
            className="social-links-block-twitter"
            target="_blank"
          >
            <FontAwesome name="twitter"/>
            <span className="social-text">
              Follow @Githubifyme
            </span>
          </a>
        </div>
        <div className="clearfix">
          <a
            href="https://github.com/Sacret/githubify"
            className="social-links-block-github"
            target="_blank"
          >
            <FontAwesome name="github" />
            <span className="social-text">
              Fork repo on Github
            </span>
          </a>
        </div>
      </div>
    );
  }
});

export default SocialLinksBlock;
