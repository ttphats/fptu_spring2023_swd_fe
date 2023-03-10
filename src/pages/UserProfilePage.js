import React from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import Nav from '../layouts/dashboard/nav';
import UserProfile from '../sections/profile/UserProfile';
import NavUser from '../layouts/dashboard/nav-user';

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const UserProfilePage = () => {
  const currentUser = useSelector((state) => state.user.current);

  return (
    <StyledRoot>
      {currentUser.role === 'USER' ? <NavUser /> : <Nav />}
      <UserProfile />
    </StyledRoot>
  );
};

export default UserProfilePage;
