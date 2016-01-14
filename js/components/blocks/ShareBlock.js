'use strict';

import React from 'react';

import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share';

const {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const LinkedinIcon = generateShareIcon('linkedin');
const PinterestIcon = generateShareIcon('pinterest');

/**
 *  ShareBlock contains user info
 */
const ShareBlock = React.createClass({

  render() {
    const shareUrl = 'http://githubify.me/';
    const title = 'Githubify.me (place to manage and organize tags for your repos)';
    //
    return (
      <div className="share-block center-block">
        <div className="share-block-info">
          <FacebookShareButton
            url={shareUrl}
            title={title}
            className="share-block-share-button">
            <FacebookIcon
              size={32}
              round={true} />
          </FacebookShareButton>
        </div>

        <div className="share-block-info">
          <TwitterShareButton
            url={shareUrl}
            title={title}
            className="share-block-share-button">
            <TwitterIcon
              size={32}
              round={true} />
          </TwitterShareButton>
        </div>

        <div className="share-block-info">
          <GooglePlusShareButton
            url={shareUrl}
            className="share-block-share-button">
            <GooglePlusIcon
              size={32}
              round={true} />
          </GooglePlusShareButton>
        </div>

        <div className="share-block-info">
          <LinkedinShareButton
            url={shareUrl}
            title={title}
            className="share-block-share-button">
            <LinkedinIcon
              size={32}
              round={true} />
          </LinkedinShareButton>
        </div>
      </div>
    );
  }
});

export default ShareBlock;
