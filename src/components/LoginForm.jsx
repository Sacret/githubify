import { login } from '../auth';
import { MAX_TAGS, MAX_TAG_LENGTH } from '../tags';
import ShareBlock from './ShareBlock';

/**
 *  LoginForm contains authorization form
 */
export default function LoginForm() {
  return (
    <div className="container login-container">
      <p className="login-header text-center">
        GITHUBIFY.<span className="header-title">me</span>
      </p>
      <h4 className="login-page-paragraph">
        Welcome to the place where you can easily manage and organize tags for your Github repositories. You will have ability to set tags for your own repos, repositories that you have been added to as a member and even starred repos!
      </h4>
      <h4 className="login-page-paragraph">
        <strong>Note:</strong> maximum count of tags per user is {MAX_TAGS}, max length of tag title is {MAX_TAG_LENGTH}
      </h4>
      <h4 className="login-page-paragraph">
        <strong>A bit of history:</strong> this project was created in December 2015 to make it easier to work with a large number of repositories. In February 2017 GitHub introduced <a href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics" target="_blank" rel="noreferrer">topics</a>, which provide the same functionality, so the project has lost its relevance. Still, I've kept it in working order as a memento.
      </h4>
      <img
        src="/img/example.png"
        className="center-block example-tags img-responsive"
        alt="Example of tags"
      />
      <div className="login-form">
        <button
          type="button"
          className="btn btn-primary center-block text-center"
          onClick={login}
        >
          Login with Github
          <i className="fa fa-github login-button-icon" />
        </button>
        Tell your friends:
        <ShareBlock />
      </div>
    </div>
  );
}
