/**
 *  Social links block contains github link
 */
export default function SocialLinksBlock() {
  return (
    <div className="social-links-block pull-right">
      <div className="clearfix">
        <a
          href="https://github.com/Sacret/githubify"
          className="social-links-block-github"
          target="_blank"
          rel="noreferrer"
        >
          <i className="fa fa-github" />
          <span className="social-text">
            Fork repo on Github
          </span>
        </a>
      </div>
    </div>
  );
}
