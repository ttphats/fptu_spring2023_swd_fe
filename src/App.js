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
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------
export default function App() {
  const navigate = useNavigate();

  // Handle firebase auth changed
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user && !localStorage.getItem('token-info')) {
        console.log('User is not logged in');
        navigate('/login', { replace: true });
        return;
      }
      const token = await user.getIdToken();
      console.log(token)
      localStorage.setItem('token-info', token);
      navigate('/dashboard', { replace: true });
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
