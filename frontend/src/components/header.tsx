import React from 'react';
import logo from '../assets/logo192.png';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

const Header = () => {
  return (
    <Grid sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
      <Grid>
        <img
          src={logo}
          alt="Savant"
          style={{
            marginRight: '1rem',
            width: '80px',
            height: '80px',
            borderRadius: '20%'
          }}
        />
      </Grid>
      <Grid>
        <Typography variant="h3">Savant </Typography>
        <Typography variant="h6">The ultimate document whisperer!</Typography>
      </Grid>
    </Grid>
  );
};

export default Header;
