import React from 'react';
import logo from '../assets/logo192.png';
import Typography from '@mui/material/Typography';
import { Grid, TextField } from '@mui/material';

export interface HeaderProps {
  onUpdateSystemPrompt: (prompt: string) => void;
}

const Header = ({ onUpdateSystemPrompt }: HeaderProps) => {
  return (
    <Grid sx={{ display: 'flex', alignItems: 'center', p: 1, gap: 2 }}>
      <Grid>
        <img
          src={logo}
          alt="Savant"
          style={{
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
      <Grid sx={{ flex: 1 }}>
        <TextField
          label="System Prompt (optional)"
          variant="outlined"
          onChange={(event) => onUpdateSystemPrompt(event.target.value)}
          multiline
          rows={4}
          fullWidth
          InputProps={{
            style: {
              color: '#EEE',
              height: '100%',
              alignItems: 'flex-start'
            }
          }}
          sx={{ label: { color: '#888' } }}
        />
      </Grid>
    </Grid>
  );
};

export default Header;
