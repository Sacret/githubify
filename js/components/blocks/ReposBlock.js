'use strict';

import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';
import moment from 'moment';
//
import { Col, Thumbnail } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
//
import ReposActions from '../../actions/ReposActions';
//
import ReposStore from '../../stores/ReposStore';

/**
 *  ReposBlock contains authorization form
 */
const ReposBlock = React.createClass({

  mixins: [Reflux.connect(ReposStore, 'reposStore')],

  componentDidMount() {
    ReposActions.getRepos(this.props.accessToken);
  },

  render() {
    let reposStore = this.state.reposStore;
    console.log('reposStore', reposStore);
    //
    let repos = null;
    if (reposStore) {
      repos = _.map(reposStore, (repo, index) => {
        return (
          <Thumbnail key={'repo' + index} className="repo">
            <Col xs={9}>
              <a href={repo.html_url}>
                <p className="repo-name">{repo.name}</p>
              </a>
              <p>{repo.description}</p>
              <small className="repo-updated">
                Updated on {moment(repo.updated_at).format('MMM D, YYYY')}
              </small>
            </Col>
            <Col xs={3} className="text-right">
              <span className="repo-language">{repo.language}</span>
              <span className="repo-stars">
                <FontAwesome name="star" /> {repo.stargazers_count}
              </span>
              <span className="repo-forks">
                <FontAwesome name="code-fork" /> {repo.forks_count}
              </span>
            </Col>
          </Thumbnail>
        );
      });
    }
    //
    return (
      <div>
        {repos}
      </div>
    );
  }
});

export default ReposBlock;
