import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
// @mui
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const currentUser = useSelector((state) => state.user.current);
  const logo = (
    <Box ref={ref} component="img" src="/assets/logo.svg" sx={{ width: 192, height: 192, cursor: 'pointer', ...sx }} />
  );

  if (disabledLink) {
    return <>{logo}</>;
  }
  return (
    <>
      {
    currentUser.role === "USER" ? (
      <Link to="/home" component={RouterLink} sx={{ display: 'contents' }}>
        {logo}
      </Link>
    ) : (
      <Link to="/dashboard" component={RouterLink} sx={{ display: 'contents' }}>
        {logo}
      </Link>
    )
    }
    </>);
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
