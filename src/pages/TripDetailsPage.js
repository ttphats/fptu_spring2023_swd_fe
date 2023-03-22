import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import tripApi from '../api/tripApi';
import Nav from '../layouts/dashboard/nav';
import NavUser from '../layouts/dashboard/nav-user';
import TripDetails from '../sections/trip/TripDetails';
import LoadingSpinner from '../components/loading/LoadingSpinner';

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const TripDetailsPage = () => {
  const currentUser = useSelector((state) => state.user.current);
  const { id } = useParams();
  const [trip, setTrip] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getTrip() {
      try {
        const trip = await tripApi.getTripById(id);
        setTrip(trip.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    getTrip();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <StyledRoot>
        {currentUser.role === 'USER' ? <NavUser /> : <Nav />}
        {/* {currentUser.role === 'USER' ?  : <TripDetails id={id} />} */}
      <TripDetails trip={trip} />
      </StyledRoot>
    </>
  );
};

export default TripDetailsPage;
