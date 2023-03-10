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
  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Router />
    </ThemeProvider>
  );
}
