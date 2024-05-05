import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { DefaultSession } from 'next-auth';
import Home from '../components/home/Home';
import Greeting from './LandingPage';
import AuthHelper from '../helpers/AuthHelper';

interface SessionExt extends DefaultSession {
  token: {
    email: string;
    sub: string;
    id_token: string;
    name: string;
    picture: string;
  };
}

const Main = () => {
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserSet, setIsUserSet] = useState(false);

  useEffect(() => {
    // Custom User logged in
    if (!isUserSet) {
      AuthHelper.authMeRequest().then((response) => {
        if (response.status === 200) {
          setIsLoggedIn(true);
          setIsUserSet(true);
        }
      });
    }

    // Google User logged in
    if (session !== null && session !== undefined && !isLoggedIn) {
      // Get the session info
      const currentSession = session as SessionExt;
      const googleSSORequest = {
        email: currentSession.token.email,
        sub: currentSession.token.sub,
        token: currentSession.token.id_token,
        avatar: currentSession.token.picture,
        name: currentSession.token.name,
      };

      AuthHelper.loginGoogleSSO(googleSSORequest).then((response) => {
        if (response.status === 200) {
          if (!isUserSet) {
            AuthHelper.authMeRequest().then((response) => {
              if (response.status === 200) {
                setIsLoggedIn(true);
                setIsUserSet(true);
              }
            });
          }
        }
      });
    }
  }, [session, isLoggedIn]);

  return (
    <>
      {isLoggedIn ? <Home /> : <Greeting />}
    </>
  );
};

export default Main;
