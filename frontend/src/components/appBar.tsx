import React from 'react';
import { AppBar, Grid, Toolbar, Typography } from '@mui/material';
import logo from '../assets/logo192.png';
import { useTheme } from '@mui/system';

const AppBarComponent: React.FC = () => {
  const theme = useTheme();
  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          borderBottom: `solid 1px ${theme.palette.grey[800]}`,
          backgroundColor: theme.palette.grey[900]
        }}
      >
        <Grid sx={{ display: 'flex', alignItems: 'center', p: 1, gap: 2 }}>
          <img
            src={logo}
            alt="Savant"
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '20%'
            }}
          />
          <Grid>
            <Typography variant="h5">Savant </Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
