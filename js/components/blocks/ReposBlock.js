'use strict';

import React from 'react';
import ReactFireMixin from 'reactfire';
import Reflux from 'reflux';
import _ from 'lodash';
import moment from 'moment';
//
import { Col, Thumbnail, Button, Input } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
//
import Config from '../../config/Config';
//
import ReposActions from '../../actions/ReposActions';
//
import ReposStore from '../../stores/ReposStore';

/**
 *  ReposBlock contains authorization form
 */
const ReposBlock = React.createClass({

  mixins: [Reflux.connect(ReposStore, 'reposStore'), ReactFireMixin],

  componentDidMount() {
    ReposActions.getRepos(this.props.userStore.accessToken);
  },

  componentWillMount() {
    let userID = this.props.userStore.info.id;
    const ref = new Firebase(Config.FirebaseUrl + 'user' + userID + '/tags');
    this.bindAsArray(ref, 'tags');
  },

  addTag(index, repoID) {
    let _this = this;
    let tagNames = _this.refs['repoTagsInput' + index].getValue().trim();
    let tagNamesArray = tagNames.split(',');
    //
    _.forEach(tagNamesArray, (tagName) => {
      let correctTagName = tagName.trim();
      if (correctTagName.length) {
        let existingTag = _.findWhere(this.state.tags, {'title': correctTagName});
        if (!existingTag) {
          _this.firebaseRefs.tags.push({
            title: correctTagName
          });
        }
        existingTag = _.findWhere(this.state.tags, {'title': correctTagName});
        _this.firebaseRefs.tags.child(existingTag['.key']).child('repos').push({
          id: repoID
        });
      }
    });
  },

  render() {
    let reposStore = this.state.reposStore;
    console.log('reposStore', reposStore);
    let tagsStore = this.state.tags;
    //
    let repos = null;
    if (reposStore) {
      repos = _.map(reposStore, (repo, index) => {
        let innerButton = <Button
          type="reset"
          onClick={() => this.addTag(index, repo.id)}
        >
          Add tag
        </Button>;
        //
        let tags = _.filter(tagsStore, (tag) => {
          return _.includes(tag.repos, {id: repo.id});
        });
        //
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
              <form>
                <Input
                  type="text"
                  ref={'repoTagsInput' + index}
                  buttonAfter={innerButton}
                />
              </form>
              <small className="repo-tags-tip">
                Type one or several tags (divided by comma)
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
