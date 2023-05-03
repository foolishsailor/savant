import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { Message } from '../types/message';

export interface QueryInputProps {
  addResponse: (response: Message) => void;
  systemPrompt: string;
}

const QueryInput = ({ addResponse, systemPrompt }: QueryInputProps) => {
  const [inputText, setInputText] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const queryDocuments = async () => {
    addResponse({ source: 'user', content: inputText });
    setInputText('');

    try {
      const result = await fetch('http://localhost:4000/askQuestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: inputText, systemPrompt })
      });
      // Read the response body as a stream
      const reader = result.body?.getReader();

      let receivedData = '';

      // Function to process the stream
      const readStream = async () => {
        if (reader) {
          try {
            const { done, value } = await reader.read();

            if (done) {
              console.log('Stream finished');
              return;
            }

            // Decode the received chunk and add it to the receivedData string
            receivedData += new TextDecoder().decode(value);

            // Parse the JSON data and update the component state
            const parsedData = JSON.parse(receivedData);
            console.log('response from server: ', parsedData.response);
            addResponse({ source: 'assistant', content: parsedData.response });

            // Continue reading the stream
            readStream();
          } catch (error) {
            console.error('Error while reading the stream: ', error);
          }
        }
      };

      // Start reading the stream
      readStream();
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
        height: 150
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
