import { useEffect } from 'react';
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

// ----------------------------------------------------------------------
export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('access-token')) {
      unwrapResult(dispatch(getMe()));
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
