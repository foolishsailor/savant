import React, { useState } from 'react';
import {
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  TextField,
  Button,
  Grid
} from '@mui/material';

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
              const commandFilteredOut = decodedChunk
                .split('c0fb7f7030574dd7801ae6f2d53dfd51')
                .join('');
              const lastElementIndex = prev.length - 1;
              const updatedAssistantMessage: Message = {
                source: 'assistant',
                content:
                  decodedChunk === 'c0fb7f7030574dd7801ae6f2d53dfd51'
                    ? (prev[lastElementIndex].content = '')
                    : prev[lastElementIndex].content + commandFilteredOut
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
      <Grid item container spacing={1} alignItems="center">
        <Grid item xs={6}>
          <Slider
            defaultValue={0.5}
            min={0}
            step={0.1}
            max={1}
            valueLabelDisplay="auto"
            marks={[
              { value: 0, label: 'precise' },
              { value: 0.5, label: 'neutral' },
              { value: 1, label: 'creative' }
            ]}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={4}>
          <RadioGroup row defaultValue="simple">
            <FormControlLabel
              value="simple"
              control={<Radio />}
              label="Simple"
            />
            <FormControlLabel
              value="revision"
              control={<Radio />}
              label="Revision"
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={2} container justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={queryDocuments}>
            Send
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default React.memo(QueryInput);
