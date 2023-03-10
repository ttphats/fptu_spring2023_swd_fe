import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
// firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { fetchNotify } from '../../firebase-message';
//
import Header from './header';
import NavUser from './nav-user';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function HomeLayout() {
  const loginInfo = useSelector((state) => state.auth.loginInfo);
  const [open, setOpen] = useState(false);

  // Handle get message push notify
  useEffect(() => {
    if (loginInfo && localStorage.getItem('access-token')) {
      fetchNotify();
      firebase.messaging().onMessage((data) => {
        new Notification(data.notification.title, {
          body: data.notification.body,
          image: data.notification.image,
        });
      });
    }
  }, [localStorage.getItem('access-token')]);
  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />

      <NavUser openNav={open} onCloseNav={() => setOpen(false)} />

      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
