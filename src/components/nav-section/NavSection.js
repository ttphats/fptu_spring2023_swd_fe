import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
import firebase from 'firebase/compat/app';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}
// ----------------------------------------------------------------------
NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({item}) {
  const { title, path, icon, info } = item;

  const handleLogout = () => {
    console.log('remove', title);
    if(title === 'Đăng xuất'){
      localStorage.removeItem('access-token')
      firebase.auth().signOut();
    }
  }

  return (
    <StyledNavItem
      title={item.title}
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
      onClick={handleLogout}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
      <ListItemText disableTypography primary={title} />
      {info && info}
    </StyledNavItem>
  );
}
