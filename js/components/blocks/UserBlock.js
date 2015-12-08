'use strict';

import React from 'react';
import Reflux from 'reflux';
import moment from 'moment';
//
import { Row, Col } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
//
import ShareBlock from './ShareBlock';
//
import UserActions from '../../actions/UserActions';

/**
 *  UserBlock contains user info
 */
const UserBlock = React.createClass({

  handleLogoutClick() {
    UserActions.logout();
  },

  render() {
    let info = this.props.info;
    //
    return (
      <div className="user-block">
        {
          info ?
            <Row>
              <Col md={2} xs={4} className="user-block-avatar">
                <a href={info.html_url}>
                  <img src={info.avatar_url} className="user-block-avatar-img" />
                </a>
              </Col>
              <Col md={2} xs={4} className="user-block-main-info">
                <p className="user-block-main-info-name">{info.name}</p>
                <p className="user-block-main-info-login">{info.login}</p>
              </Col>
              <Col md={2} col xs={4} className="user-block-add-info">
                {
                  info.location ?
                    <p className="user-block-add-info-location">
                      <FontAwesome name="map-marker" />
                      {info.location}
                    </p> :
                    null
                }
                {
                  info.email ?
                    <p className="user-block-add-info-email">
                      <FontAwesome name="envelope-o" />
                      <a href={'mailto:' + info.email}>{info.email}</a>
                    </p> :
                    null
                }
                {
                  info.blog ?
                    <p className="user-block-add-info-link">
                      <FontAwesome name="link" />
                      <a href={info.blog}>{info.blog}</a>
                    </p> :
                    null
                }
                <p className="user-block-add-info-created">
                  <FontAwesome name="clock-o" />
                  Joined on {moment(info.created_at).format('MMM D, YYYY')}
                </p>
              </Col>
              <Col md={2} xs={4} className="user-block-follow-info">
                <p>
                  <span className="user-block-follow-info-num">
                    <a href={info.html_url + '/followers'}>
                      {info.followers}
                    </a>
                  </span> Followers
                </p>
                <p>
                  <span className="user-block-follow-info-num">
                    <a href={info.html_url + '/following'}>
                      {info.following}
                    </a>
                  </span> Following
                </p>
              </Col>
              <Col md={2} xs={4}>
                <ShareBlock />
              </Col>
              <Col md={2} xs={4} className="user-block-github text-center">
                <FontAwesome name="github" />
                <p>Fork me on Github</p>
              </Col>
            </Row> :
            null
        }
      </div>
    );
  }
});

export default UserBlock;
