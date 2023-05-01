import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

export interface QueryInputProps {
  onResponse: (response: string) => void;
}

const QueryInput = ({ onResponse }: QueryInputProps) => {
  const [inputText, setInputText] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const queryDocuments = async () => {
    try {
      const result = await fetch('http://localhost:4000/askQuestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: inputText })
      });
      const data = await result.json();

      onResponse(data.response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid
      item
      container
      rowGap={1}
      sx={{
        pt: 2,
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        height: '100%'
      }}
    >
      <Grid item container sx={{ flex: 1 }}>
        <TextField
          fullWidth
          label="Query Documents"
          value={inputText}
          onChange={handleChange}
          multiline
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
      <Grid item sx={{}}>
        <Button variant="contained" color="primary" onClick={queryDocuments}>
          Send
        </Button>
      </Grid>
    </Grid>
  );
};

export default QueryInput;
