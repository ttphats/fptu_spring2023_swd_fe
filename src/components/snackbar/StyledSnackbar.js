import * as React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function StyledSnackbar(props) {
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });
  const [open, setOpen] = React.useState(false);
  const { vertical, horizontal } = state;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setState({ ...state});
  };
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={props.open}
        onClose={handleClose}
        autoHideDuration={2000}
        message={props.message}
        key={vertical + horizontal}
      >
        <Alert variant="outlined" severity={props.severity} sx={{ width: '100%' }}>
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
