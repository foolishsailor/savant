import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { Message } from '../types/message';

export interface QueryInputProps {
  addResponse: React.Dispatch<React.SetStateAction<Message[]>>;
  systemPrompt: string;
}

const QueryInput = ({ addResponse, systemPrompt }: QueryInputProps) => {
  const [inputText, setInputText] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const queryDocuments = async () => {
    console.log('query DOcuments ======================');
    addResponse((prev) => [...prev, { source: 'user', content: inputText }]);
    addResponse((prev) => [...prev, { source: 'assistant', content: '' }]);
    setInputText('');

    try {
      const result = await fetch('http://localhost:4000/askQuestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: inputText, systemPrompt })
      });
      // Read the response body as a stream
      const reader = result.body?.getReader();

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
            const decodedChunk = new TextDecoder().decode(value);

            addResponse((prev) => {
              const lastElementIndex = prev.length - 1;
              const updatedAssistantMessage: Message = {
                source: 'assistant',
                content: prev[lastElementIndex].content + decodedChunk
              };
              const newConversation = [...prev];
              newConversation[lastElementIndex] = updatedAssistantMessage;
              return newConversation;
            });

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

export default React.memo(QueryInput);
