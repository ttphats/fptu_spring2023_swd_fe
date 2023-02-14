import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// firebase
import firebase from "./firebase";
import 'firebase/compat/auth';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import loginApi from './api/loginApi';
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------
export default function App() {
  const navigate = useNavigate();
  
  useEffect(() => {
    if(!localStorage.getItem('token-info')){
      navigate('/login', { replace: true });
    }
  })
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
      navigate('/dashboard', { replace: true });
      console.log('Logged in user: ', token);
    });
    return () => unregisterAuthObserver();
  }, []);
  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Router/>
    </ThemeProvider>
  );
}
