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

  componentDidMount() {
    UserActions.getUser(this.props.accessToken, this.props.uname);
  },

  render() {
    const info = this.props.info;
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
              <Col md={8} xs={4} className="user-block-main-info">
                <p className="user-block-main-info-name">{info.name}</p>
                <p className="user-block-main-info-login">{info.login}</p>
              </Col>
              <Col md={2} xs={4} className="user-block-github text-center">
                <FontAwesome name="github" />
                <p>
                  <a href="https://github.com/Sacret/githubify" target="_blank">
                    Fork me on Github
                  </a>
                </p>
                <ShareBlock />
              </Col>
            </Row> :
            null
        }
      </div>
    );
  }
});

export default UserBlock;
