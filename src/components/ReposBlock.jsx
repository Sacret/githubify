import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Masonry from 'masonry-layout';
//
import { useFilters } from '../filters';
import {
  MAX_TAGS,
  addRepoTags,
  normalizeTagName,
  removeRepoTag,
  tagRepoIds
} from '../tags';
import Highlight from './Highlight';
import SortingBlock from './SortingBlock';
import TagLimitModal from './TagLimitModal';
import Typeahead from './Typeahead';

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

/**
 *  ReposBlock contains list of repos with their tags
 */
export default function ReposBlock({ repos, tags, openUser, isOwner, isShowingOwner }) {
  const { filters } = useFilters();
  const navigate = useNavigate();
  const container = useRef(null);
  const [isLimitModalShown, setIsLimitModalShown] = useState(false);
  const tagKeys = (tags || []).map((tag) => tag.key);

  useLayoutEffect(() => {
    const masonry = new Masonry(container.current, {
      itemSelector: '.repo-item',
      transitionDuration: 0
    });
    return () => masonry.destroy();
  }, [repos, tags]);

  function addTags(repo, repoTags, value) {
    const names = [...new Set(value.split(',').map(normalizeTagName))]
      .filter((name) => name && !repoTags.includes(name));
    const newTagsCount = names.filter((name) => !tagKeys.includes(name)).length;
    if (tagKeys.length + newTagsCount > MAX_TAGS) {
      setIsLimitModalShown(true);
      return;
    }
    if (names.length) {
      addRepoTags(openUser.id, names, repo.id);
    }
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-9 col-xs-6">
          <p className="repos-block-total-count">
            {repos.length} repo{repos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="col-md-3 col-xs-6">
          <SortingBlock />
        </div>
      </div>
      <div className="row" ref={container}>
        {repos.map((repo) => {
          const repoTags = (tags || []).filter((tag) => tagRepoIds(tag).includes(repo.id));
          const repoTagKeys = repoTags.map((tag) => tag.key);
          return (
            <div className="col-xs-12 col-md-4 repo-item" key={repo.id}>
              <div className="thumbnail repo">
                <div className="caption">
                  <div className="col-xs-12">
                    <a href={repo.html_url} target="_blank" rel="noreferrer">
                      <p className="repo-name">
                        <Highlight text={repo.name} search={filters.searchStr} />
                      </p>
                    </a>
                    {isShowingOwner ?
                      <p className="repo-owner">
                        by <a
                          href={'/' + repo.owner.login}
                          className="repo-owner-name"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate('/' + repo.owner.login);
                          }}
                        >
                          {repo.owner.login}
                        </a>
                      </p> :
                      null
                    }
                    <small className="repo-updated">
                      Updated on {dateFormat.format(new Date(repo.updated_at))}
                      <span className="pull-right">
                        <i className="fa fa-star" />
                        &nbsp;{repo.stargazers_count}
                      </span>
                    </small>
                    <div className="clearfix">
                      {repoTags.map((tag) => (
                        <span className="repo-tag" key={tag.key}>
                          {tag.key}
                          {isOwner ?
                            <i
                              className="fa fa-times tag-icon tag-remove-icon"
                              onClick={() => removeRepoTag(openUser.id, tag, repo.id)}
                            /> :
                            null
                          }
                        </span>
                      ))}
                      {repo.language ?
                        <span className="repo-tag repo-language-tag">{repo.language}</span> :
                        null
                      }
                    </div>
                    {isOwner ?
                      <div className="repo-form">
                        <Typeahead
                          options={tagKeys.filter((key) => !repoTagKeys.includes(key))}
                          placeholder="Type comma-separated tags"
                          onSubmit={(value) => addTags(repo, repoTagKeys, value)}
                        />
                      </div> :
                      null
                    }
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {isLimitModalShown ?
        <TagLimitModal onHide={() => setIsLimitModalShown(false)} /> :
        null
      }
    </div>
  );
}
