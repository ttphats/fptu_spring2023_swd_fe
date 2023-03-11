import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Nav from '../layouts/dashboard/nav';
import NavUser from '../layouts/dashboard/nav-user';
import CreateTrip from '../sections/trip/CreateTrip';

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const CreateTripPage = () => {
  const currentUser = useSelector((state) => state.user.current);

  return (
    <StyledRoot>
      {currentUser.role === 'USER' ? <NavUser /> : <Nav />}
      {currentUser.role === 'USER' ? <CreateTrip /> :  <Navigate to="/dashboard"/>}
    </StyledRoot>
  );
};

export default CreateTripPage;
