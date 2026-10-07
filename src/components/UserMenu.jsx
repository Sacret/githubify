import { Link } from 'react-router';
//
import { login, logout } from '../auth';

/**
 *  User menu displays user links
 */
export default function UserMenu({ user }) {
  if (user === undefined) {
    return null;
  }
  if (!user) {
    return <button type="button" className="btn-link" onClick={login}>Login</button>;
  }
  return (
    <div>
      <Link to={'/' + user.login}>{user.login}</Link>
      <span className="logged-in-user-divider" />
      <button type="button" className="btn-link" onClick={logout}>Logout</button>
    </div>
  );
}
