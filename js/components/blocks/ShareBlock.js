'use strict';

import React from 'react';
import Reflux from 'reflux';
import queryString from 'query-string';
//
import FontAwesome from 'react-fontawesome';
//
import { OverlayTrigger, Popover, Input } from 'react-bootstrap';
//
import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share';
//
import FilterStore from '../../stores/FilterStore';

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

  mixins: [
    Reflux.connect(FilterStore, 'filterStore')
  ],

  handleFocus(e) {
    e.target.select();
  },

  render() {
    const filterStore = this.state.filterStore;
    //
    let appliedFilter = '';
    if (filterStore) {
      const { filter, searchStr, tags, languages, sort, direction } = filterStore;
      const [ isFilter, isTags, isLanguages, isSearch, isSort ] = [
        filter !== 'all',
        tags && tags.length,
        languages && languages.length,
        searchStr.length,
        sort && direction && !(sort == 'name' && direction == 'asc')
      ];
      const isFiltered = isFilter || isTags || isLanguages || isSearch || isSort;
      if (isFiltered) {
        const filters = {};
        if (isFilter) {
          filters.filter = filter;
        }
        if (isSearch) {
          filters.searchStr = searchStr;
        }
        if (isTags) {
          filters.tags = tags;
        }
        if (isLanguages) {
          filters.languages = languages;
        }
        if (isSort) {
          filters.sort = sort;
          filters.direction = direction;
        }
        appliedFilter = '?' + queryString.stringify(filters);
      }
    }
    //
    const shareUrl = 'https://githubify.me/' +
      (this.props.name || '') + appliedFilter;
    const title = 'Githubify.me (place to manage and organize tags for your repos)';
    //
    return (
      <div className="share-block clearfix">
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

        <div className="share-block-info">
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            rootClose
            overlay={
              <Popover title="Copy link and share with friends" id="share-link">
                <Input
                  type="text"
                  value={shareUrl}
                  readOnly
                  autoFocus
                  onFocus={this.handleFocus}
                />
              </Popover>
            }
          >
            <FontAwesome
              name="link"
              className="share-block-share-button share-block-share-button-link"
            />
          </OverlayTrigger>
        </div>
      </div>
    );
  }
});

export default ShareBlock;
