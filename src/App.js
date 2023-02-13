import { useEffect } from 'react';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import loginApi from './api/loginApi';
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';


// ----------------------------------------------------------------------

export default function App() {
  const token = localStorage.getItem("token-info");
  console.log(token);
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
  }, [])
  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Router />
    </ThemeProvider>
  );
}
