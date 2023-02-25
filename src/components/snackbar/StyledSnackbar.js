import * as React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function StyledSnackbar(props) {
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });
  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={props.open}
        onClose={handleClose}
        autoHideDuration={3000}
        message= {props.message}
        key={vertical + horizontal}>
          <Alert severity={props.severity} sx={{ width: '100%' }}>
            {props.message}
          </Alert>
        </Snackbar>
    </div>
  );
}