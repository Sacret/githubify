import { Navigate } from 'react-router';
//
import { useAuth } from '../auth';
import LoadingBlock from '../components/LoadingBlock';
import LoginForm from '../components/LoginForm';

/**
 *  Login page contains login form
 */
export default function LoginPage() {
  const user = useAuth();

  if (user) {
    return <Navigate to={'/' + user.login} replace />;
  }
  return (
    <div className="container-fluid login-page">
      <div className="row">
        <div className="col-xs-12 content-block">
          {user === undefined ? <LoadingBlock /> : <LoginForm />}
        </div>
      </div>
    </div>
  );
}
