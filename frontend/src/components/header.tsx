import React from 'react';
import { setSystemPrompt } from '../store/conversationSlice';
import { Grid, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';

const Header = () => {
  const dispatch = useDispatch();
  const systemPromptHandler = (prompt: string) => {
    dispatch(setSystemPrompt(prompt));
  };

  return (
    <Grid sx={{ display: 'flex', alignItems: 'center', p: 1, gap: 2 }}>
      <Grid sx={{ flex: 1 }}>
        <TextField
          label="System Prompt (optional)"
          variant="outlined"
          onChange={(event) => systemPromptHandler(event.target.value)}
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
