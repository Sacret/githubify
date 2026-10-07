import { useEffect, useState } from 'react';
import { Link } from 'react-router';
//
import { useAuth } from '../auth';
import { filterRepos, useFilters } from '../filters';
import { getRepos, getUser } from '../github';
import { useTags } from '../tags';
//
import ClearFiltersBlock from '../components/ClearFiltersBlock';
import EmptyUserBlock from '../components/EmptyUserBlock';
import FilterBlock from '../components/FilterBlock';
import LanguagesBlock from '../components/LanguagesBlock';
import LoadingBlock from '../components/LoadingBlock';
import ReposBlock from '../components/ReposBlock';
import SearchBlock from '../components/SearchBlock';
import TagsBlock from '../components/TagsBlock';
import UserBlock from '../components/UserBlock';
import UserMenu from '../components/UserMenu';

function errorMessage(error) {
  return error.isRateLimit ?
    'GitHub API rate limit exceeded. Please try again later' :
    'Unable to load data from GitHub';
}

/**
 *  Main page contains tags, filters and repos
 */
export default function MainPage({ uname }) {
  const user = useAuth();
  const { filters } = useFilters();
  // { status: 'loading' | 'ready' | 'error', data, error }
  const [openUser, setOpenUser] = useState({ status: 'loading' });
  const [repos, setRepos] = useState({ status: 'loading', data: [] });

  useEffect(() => {
    const controller = new AbortController();
    getUser(uname, controller.signal)
      .then((data) => setOpenUser({ status: 'ready', data }))
      .catch((error) => {
        if (!controller.signal.aborted) {
          setOpenUser({ status: 'error', error });
        }
      });
    return () => controller.abort();
  }, [uname]);

  useEffect(() => {
    const controller = new AbortController();
    setRepos({ status: 'loading', data: [] });
    getRepos(uname, filters.filter, controller.signal)
      .then((data) => setRepos({ status: 'ready', data }))
      .catch((error) => {
        if (!controller.signal.aborted) {
          setRepos({ status: 'error', data: [], error });
        }
      });
    return () => controller.abort();
  }, [uname, filters.filter]);

  if (openUser.status === 'loading') {
    return <LoadingBlock />;
  }
  if (openUser.status === 'error') {
    return (
      <EmptyUserBlock
        user={user}
        message={openUser.error.status === 404 ?
          'Github user ' + uname + " doesn't exist" :
          errorMessage(openUser.error)}
      />
    );
  }
  return (
    <UserPage
      user={user}
      openUser={openUser.data}
      repos={repos}
      filters={filters}
    />
  );
}

function UserPage({ user, openUser, repos, filters }) {
  const tags = useTags(openUser.id);
  const isOwner = Boolean(user) && user.id === String(openUser.id);
  const filteredRepos = filterRepos(repos.data, tags, filters);
  const languages = [...new Set(repos.data.map((repo) => repo.language).filter(Boolean))]
    .sort();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xs-12 content-block">
          <div className="row user-info">
            <div className="container">
              <div className="row">
                <div className="col-xs-8">
                  <h2 className="main-header">
                    <Link to="/" className="main-header-link">
                      <img src="/logo.svg" className="logo" alt="" />
                      GITHUBIFY.<span className="header-title">me</span>
                    </Link>
                  </h2>
                </div>
                <div className="col-xs-4">
                  <div className="pull-right logged-in-user">
                    <UserMenu user={user} />
                  </div>
                </div>
              </div>
              <UserBlock openUser={openUser} />
            </div>
          </div>
          <div className="row tags-info">
            <div className="container">
              <TagsBlock tags={tags} openUser={openUser} isOwner={isOwner} />
            </div>
          </div>
          <div className="row languages-info">
            <div className="container">
              <LanguagesBlock languages={languages} />
            </div>
          </div>
          <div className="row filters-info">
            <div className="container">
              <FilterBlock />
            </div>
          </div>
          <div className="row search-info">
            <div className="container">
              <SearchBlock />
            </div>
          </div>
          <div className="row clear-info">
            <div className="container">
              <ClearFiltersBlock />
            </div>
          </div>
          <div className="row repos-info">
            <div className="container">
              {repos.status === 'loading' ?
                <LoadingBlock inline /> :
                repos.status === 'error' ?
                  <p className="text-danger">{errorMessage(repos.error)}</p> :
                  <ReposBlock
                    repos={filteredRepos}
                    tags={tags}
                    openUser={openUser}
                    isOwner={isOwner}
                    isShowingOwner={['starred', 'member'].includes(filters.filter)}
                  />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
