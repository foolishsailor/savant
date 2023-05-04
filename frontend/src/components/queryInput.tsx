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
  const [sliderValue, setSliderValue] = useState(0.5);
  const [radioValue, setRadioValue] = useState('simple');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSliderChange = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    setSliderValue(value as number);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      queryDocuments();
    }
  };

  const queryDocuments = async () => {
    addResponse((prev) => [...prev, { source: 'user', content: inputText }]);
    addResponse((prev) => [...prev, { source: 'assistant', content: '' }]);
    setInputText('');

    try {
      const result = await fetch('http://localhost:4000/askQuestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: inputText,
          systemPrompt,
          queryType: radioValue,
          temperature: sliderValue
        })
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
      <Grid
        item
        container
        gap={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item sx={{ width: 500, pl: 4, pr: 4 }}>
          <Slider
            value={sliderValue}
            onChange={handleSliderChange}
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
          />
        </Grid>
        <Grid item>
          <RadioGroup row defaultValue="simple" onChange={handleRadioChange}>
            <FormControlLabel
              value="simple"
              control={<Radio />}
              label="Simple"
            />
            <FormControlLabel
              value="refine"
              control={<Radio />}
              label="Refine"
            />
          </RadioGroup>
        </Grid>
      </Grid>
      <Grid sx={{ flex: 1 }}>
        <TextField
          fullWidth
          label="Query Documents"
          value={inputText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          multiline
          rows={3}
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

export default React.memo(QueryInput);
