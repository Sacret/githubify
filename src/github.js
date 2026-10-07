const API_URL = 'https://api.github.com/';
const PER_PAGE = 100;

export class GithubError extends Error {
  constructor(response) {
    super('GitHub API error: ' + response.status);
    this.status = response.status;
    this.isRateLimit = response.status === 429 ||
      (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0');
  }
}

async function request(path, signal) {
  const response = await fetch(API_URL + path, {
    headers: { Accept: 'application/vnd.github+json' },
    signal
  });
  if (!response.ok) {
    throw new GithubError(response);
  }
  return response.json();
}

export function getUser(username, signal) {
  return request('users/' + encodeURIComponent(username), signal);
}

export function getUserById(id, signal) {
  return request('user/' + id, signal);
}

/**
 *  Loads all user's repos for the given filter:
 *  all, owner, forks, member or starred
 */
export async function getRepos(username, filter, signal) {
  const endpoint = filter === 'starred' ? 'starred' : 'repos';
  const type = filter === 'forks' ? 'owner' : filter;
  let repos = [];
  for (let page = 1; ; page++) {
    const query = new URLSearchParams({ per_page: PER_PAGE, page });
    if (endpoint === 'repos') {
      query.set('type', type);
    }
    const pageRepos = await request(
      'users/' + encodeURIComponent(username) + '/' + endpoint + '?' + query,
      signal
    );
    repos = repos.concat(pageRepos);
    if (pageRepos.length < PER_PAGE) {
      break;
    }
  }
  if (filter === 'owner' || filter === 'forks') {
    repos = repos.filter((repo) => repo.fork === (filter === 'forks'));
  }
  return repos;
}
