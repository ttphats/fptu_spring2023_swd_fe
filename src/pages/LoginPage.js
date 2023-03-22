import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Helmet } from 'react-helmet-async';
import firebase from 'firebase/compat/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
// sections
import { LoginForm } from '../sections/auth/login';
import { userLoginPublic } from '../sections/auth/login/authSlice';
import { getMe } from '../redux/Slice/userSlice';


// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// Configure FirebaseUI.
const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};
// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState();
  const currentUser = useSelector((state) => state.user.current);

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        return;
      }
      const tokenId = await user.getIdToken();
      console.log('Token: ', tokenId);
      unwrapResult(await dispatch(userLoginPublic(tokenId)));
      unwrapResult(await dispatch(getMe()));
      setAccessToken(tokenId);
      navigate('/');
      firebase.auth().signOut();
    });
    return () => unregisterAuthObserver();
  }, []);

  useEffect(()=> {
    if(localStorage.getItem('access-token')){
      console.log(currentUser.role === "USER");
      navigate('/');
      if(currentUser.role === "ADMIN"){
        navigate('/dashboard');
      } else
      if(currentUser.role === "USER"){
        navigate('/home');
      }
    }
  },[])

  return (
    <>
      <Helmet>
        <title> Cóc Phượt </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'absolute',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Chào mừng bạn trở lại
            </Typography>
            <img src="/assets/illustrations/travel_illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Đăng nhập vào Cóc Phượt
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Bạn chưa có tài khoản? {''}
              <Link href="/register" sx={{color: '#F39137'}} variant="subtitle2">
                Đăng ký ngay
              </Link>
            </Typography>

            <StyledFirebaseAuth
              uiCallback={(ui) => ui.disableAutoSignIn()}
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
            />

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                HOẶC
              </Typography>
            </Divider>

            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
