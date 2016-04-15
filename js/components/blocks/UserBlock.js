'use strict';

import React from 'react';
//
import { Row, Col } from 'react-bootstrap';
//
import ShareBlock from './ShareBlock';
import SocialLinksBlock from './SocialLinksBlock';

/**
 *  UserBlock contains user info
 */
const UserBlock = React.createClass({

  render() {
    const openUser = this.props.openUser;
    //
    return (
      <div className="user-block">
        {
          openUser ?
            <Row>
              <Col md={2} xs={4} className="user-block-avatar">
                <a href={openUser.html_url} target="_blank">
                  <img
                    src={openUser.avatar_url}
                    className="user-block-avatar-img img-responsive"
                  />
                </a>
              </Col>
              <Col md={6} xs={8} className="user-block-main-info">
                <ShareBlock name={openUser.login} />
                <p className="user-block-main-info-name">{openUser.name}</p>
                <p className="user-block-main-info-login">{openUser.login}</p>
              </Col>
              <Col md={4} xs={12} className="user-block-github">
                <SocialLinksBlock />
              </Col>
            </Row> :
            null
        }
      </div>
    );
  }
});

export default UserBlock;
