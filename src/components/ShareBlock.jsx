import { useState } from 'react';
import { useLocation } from 'react-router';

const TITLE = 'Githubify.me: a place to manage and organize tags for your GitHub repos';

/**
 *  ShareBlock contains share links for current page with applied filters
 */
export default function ShareBlock({ name }) {
  const location = useLocation();
  const [isCopied, setIsCopied] = useState(false);
  const shareUrl = window.location.origin + '/' +
    (name ? encodeURIComponent(name) + location.search : '');
  const url = encodeURIComponent(shareUrl);
  const title = encodeURIComponent(TITLE);

  const links = [
    { icon: 'facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=' + url },
    { icon: 'twitter', href: 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title },
    { icon: 'linkedin', href: 'https://www.linkedin.com/sharing/share-offsite/?url=' + url }
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      window.prompt('Copy link and share with friends', shareUrl);
    }
  }

  return (
    <div className="share-block clearfix">
      {links.map((link) => (
        <div className="share-block-info" key={link.icon}>
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="share-block-share-button"
            title={'Share on ' + link.icon}
          >
            <i className={'fa fa-' + link.icon} />
          </a>
        </div>
      ))}
      <div className="share-block-info">
        <button
          type="button"
          className="share-block-share-button"
          title={isCopied ? 'Copied!' : 'Copy link'}
          onClick={copyLink}
        >
          <i className={'fa fa-' + (isCopied ? 'check' : 'link')} />
        </button>
      </div>
    </div>
  );
}
