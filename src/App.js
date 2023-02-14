import { useEffect } from 'react';
import { Route, Navigate, useNavigate } from 'react-router-dom';
// firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// mui
import { Switch } from '@mui/material';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import loginApi from './api/loginApi';
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

import DashboardLayout from './layouts/dashboard';

// ----------------------------------------------------------------------

// Configure Firebase.
const config = {
  apiKey: 'AIzaSyAunIss-Kr0I92U3NXkmfq-tUHwsUoN1fE',
  authDomain: 'travo-cocphuot-travo.firebaseapp.com',
};
firebase.initializeApp(config);

export default function App() {
  const navigate = useNavigate();
  useEffect(() => {
    if(!localStorage.getItem('token-info')){
      navigate('/login', { replace: true });
    }
  })
  const token = localStorage.getItem('token-info');
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await loginApi.getUser();
        console.log(response);
      } catch (error) {
        console.log('Fail to fetch Api: ', error);
      }
    };
    fetchUser();
  }, []);

  // Handle firebase auth changed
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        console.log('User is not logged in');
        navigate('/login', { replace: true });
        return;
      }
      console.log('Logged in user: ', user.displayName);
      const token = await user.getIdToken();
      localStorage.setItem('token-info', token);
      console.log('Logged in user: ', token);
    });
    return () => unregisterAuthObserver();
  }, []);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Router>
        <Switch>
          <Route
            path="/dashboard"
            render={() => {
              return localStorage.getItem('token-infor') ? <DashboardLayout /> : <Navigate to="/login" />;
            }}
          />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}
