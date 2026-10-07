import ShareBlock from './ShareBlock';
import SocialLinksBlock from './SocialLinksBlock';

/**
 *  UserBlock contains user info
 */
export default function UserBlock({ openUser }) {
  return (
    <div className="user-block">
      <div className="row">
        <div className="col-md-2 col-xs-4 user-block-avatar">
          <a href={openUser.html_url} target="_blank" rel="noreferrer">
            <img
              src={openUser.avatar_url}
              className="user-block-avatar-img img-responsive"
              alt={openUser.login}
            />
          </a>
        </div>
        <div className="col-md-6 col-xs-6 user-block-main-info">
          <ShareBlock name={openUser.login} />
          <a
            href={openUser.html_url}
            className="user-block-main-info-link"
            target="_blank"
            rel="noreferrer"
          >
            <p className="user-block-main-info-name">{openUser.name}</p>
            <p className="user-block-main-info-login">{openUser.login}</p>
          </a>
        </div>
        <div className="col-md-4 col-xs-2 user-block-github">
          <SocialLinksBlock />
        </div>
      </div>
    </div>
  );
}
