import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function CustomAlert({ message, severity }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Open the Snackbar if there is a message
    if (message) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [message]);

  // Function to close the Snackbar
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}  // Alert will disappear after 6000ms = 6 seconds
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
    >
      <Alert onClose={handleClose} severity={severity || 'success'} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default CustomAlert;
