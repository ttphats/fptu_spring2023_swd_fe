import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

const LoadingSpinnerOverlay = styled('div')({
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9999,
});

const LoadingSpinner = () => {
  return (
    <LoadingSpinnerOverlay>
       <Stack sx={{ color: '#FF7300' }}>
      <CircularProgress color="inherit" size={80} thickness={5} />
      </Stack>
    </LoadingSpinnerOverlay>
  );
};

export default LoadingSpinner;
