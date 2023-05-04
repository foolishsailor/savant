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
      <Grid sx={{ flex: 1 }}>
        <TextField
          label="System Prompt (optional)"
          variant="outlined"
          onChange={(event) => onUpdateSystemPrompt(event.target.value)}
          multiline
          rows={2}
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
