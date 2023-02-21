import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
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
import { getMe } from './redux/Slice/userSlice';
import { userLoginPublic } from './sections/auth/login/authSlice';

// ----------------------------------------------------------------------
export default function App() {
  const navigate = useNavigate();
  const [tokenId, setTokenId] = useState();
  const dispatch = useDispatch();

  const fetchLogin = async () => {
    try {
      const response = unwrapResult(await dispatch(userLoginPublic(tokenId)));;
      const actionResult = dispatch(getMe());
      const currentUser = unwrapResult(actionResult);
    } catch (error) {
      console.log('Fail to fetch Api: ', error.response);
    }
  };
  // Handle firebase auth changed
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        return;
      }
      const tokenId = await user.getIdToken();
      if(tokenId){
        setTokenId(tokenId);
      }
    });
    return () => unregisterAuthObserver();
  }, [navigate]);

  useEffect(() => {
    if (tokenId) {
      fetchLogin();
    }
  }, [tokenId]);

  useEffect(() => {
    if (localStorage.getItem('access-token') && tokenId === undefined) {
      const actionResult = dispatch(getMe());
      const currentUser = unwrapResult(actionResult);
    }
  }, [localStorage.getItem('access-token')]);
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
