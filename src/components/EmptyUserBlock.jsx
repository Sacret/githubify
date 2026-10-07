import { Link } from 'react-router';

/**
 *  Empty user block contains message and links
 */
export default function EmptyUserBlock({ user, message }) {
  return (
    <div className="empty-user-block">
      <div className="empty-user-block-content text-center">
        <h3>{message}</h3>
        {user ?
          <p>You can visit <Link to={'/' + user.login}>your page</Link></p> :
          <p>You can visit <Link to="/">home page</Link></p>
        }
      </div>
    </div>
  );
}
