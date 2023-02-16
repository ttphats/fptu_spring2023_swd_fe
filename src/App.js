import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { fetchNotify } from './firebase-message';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import loginApi from './api/loginApi';

// ----------------------------------------------------------------------
export default function App() {
  const navigate = useNavigate();
  const [tokenId, setTokenId] = useState();

  const fetchLogin = async () => {
    try {
      console.log('tokenId', tokenId);
      const response = await loginApi.getLoginPublic(tokenId);
      localStorage.setItem('access-token', response.data.accessToken);
      localStorage.setItem('refesh-token', response.data.refreshToken);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.log('Fail to fetch Api: ', error.response);
    }
  };
  // Handle firebase auth changed
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user && !localStorage.getItem('access-token')) {
        navigate('/login', { replace: true });
        return;
      }
      const tokenId = await user.getIdToken();
      setTokenId(tokenId);
    });
    return () => unregisterAuthObserver();
  }, []);

  useEffect(() => {
    if (tokenId) {
      fetchLogin();
    }
  }, [tokenId]);
  // Handle get message push notify
  useEffect(() => {
    if (localStorage.getItem('access-token')) {
      fetchNotify();
      firebase.messaging().onMessage((data) => {
        new Notification(data.notification.title, {
          body: data.notification.body,
          image: data.notification.image,
        });
      });
    }
  }, []);
  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Router />
    </ThemeProvider>
  );
}
