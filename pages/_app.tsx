import '../styles/globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { AppProps } from 'next/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import Login from './login';
import Loading from 'components/Loading';
import { auth, db } from 'config/firebase';

export default function App({ Component, pageProps }: AppProps) {
  const [loggedInUser, loading, _error] = useAuthState(auth);

  useEffect(() => {
    const setUserInDb = async () => {
      try {
        await setDoc(
          doc(db, 'users', loggedInUser?.email as string),
          {
            email: loggedInUser?.email,
            lastSeen: serverTimestamp(),
            photoUrl: loggedInUser?.photoURL,
          },
          { merge: true }
        );
      } catch (error) {
        console.log('ERROR SET USER IN DATABASE', error);
      }
    };

    if (loggedInUser) {
      setUserInDb();
    }
  }, [loggedInUser]);

  if (loading) return <Loading />;

  if (!loggedInUser) return <Login />;

  return <Component {...pageProps} />;
}
