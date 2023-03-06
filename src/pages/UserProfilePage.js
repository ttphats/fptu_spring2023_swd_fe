import React from 'react';
import { styled } from '@mui/material/styles';
import Nav from '../layouts/dashboard/nav';
import UserProfile from '../sections/profile/UserProfile';

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const UserProfilePage = () => {
  return (
    <StyledRoot>
      <Nav />
      <UserProfile />
    </StyledRoot>
  );
};

export default UserProfilePage;
