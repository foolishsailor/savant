import React from 'react';
import logo from '../assets/logo192.png';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

const Header = () => {
  return (
    <Grid sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
      <img
        src={logo}
        alt="Savant"
        style={{
          marginRight: '1rem',
          width: '80px', // adjust to your needs
          height: '80px' // adjust to your needs
        }}
      />
      <Typography variant="h3">Savant </Typography>
    </Grid>
  );
};

export default Header;
