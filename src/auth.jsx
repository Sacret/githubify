import { createContext, useContext, useEffect, useState } from 'react';
import {
  GithubAuthProvider,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { get, ref, update } from 'firebase/database';
//
import { auth, db, userPath } from './firebase';
import { getUserById } from './github';

const AuthContext = createContext(null);

function getGithubId(firebaseUser) {
  const github = firebaseUser.providerData.find((p) => p.providerId === 'github.com');
  return github ? github.uid : null;
}

/**
 *  Github login is not part of Firebase user, so it's stored
 *  in the database on login and restored from there
 */
async function getGithubLogin(githubId) {
  const snapshot = await get(ref(db, userPath(githubId) + '/username'));
  if (snapshot.exists()) {
    return snapshot.val();
  }
  const user = await getUserById(githubId);
  return user.login;
}

export function AuthProvider({ children }) {
  // undefined while auth state is unknown, null for anonymous user
  const [user, setUser] = useState(undefined);

  useEffect(() => onAuthStateChanged(auth, async (firebaseUser) => {
    const githubId = firebaseUser && getGithubId(firebaseUser);
    if (!githubId) {
      setUser(null);
      return;
    }
    try {
      setUser({ id: githubId, login: await getGithubLogin(githubId) });
    } catch (error) {
      console.error('Unable to restore github login', error);
      setUser(null);
    }
  }), []);

  return <AuthContext value={user}>{children}</AuthContext>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export async function login() {
  try {
    const result = await signInWithPopup(auth, new GithubAuthProvider());
    const githubId = getGithubId(result.user);
    const username = getAdditionalUserInfo(result).username;
    await update(ref(db, userPath(githubId)), { active: true, username });
  } catch (error) {
    console.error('Login failed', error);
  }
}

export function logout() {
  return signOut(auth);
}
