import React, { useState, ChangeEvent } from 'react';
import {
  Grid,
  Slider,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  useTheme,
  TextField
} from '@mui/material';
import { ExpandMore, Settings } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {
  setDocumentRetrievalType,
  setSystemPrompt,
  setTemperature
} from 'store/conversationSlice';
import { RootState } from 'store';

type RadioValue = 'simple' | 'refine';

const SettingsSlider = ({ isOpen }: { isOpen: boolean }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const temperature = useSelector(
    (state: RootState) => state.conversation.temperature
  );
  const documentRetrievalType = useSelector(
    (state: RootState) => state.conversation.documentRetrievalType
  );

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    dispatch(setTemperature(newValue as number));
  };

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setDocumentRetrievalType(event.target.value as RadioValue));
  };

  const systemPromptHandler = (prompt: string) => {
    dispatch(setSystemPrompt(prompt));
  };

  return (
    <>
      <Grid
        container
        sx={{
          bottom: isOpen ? 60 : -200,
          position: 'absolute',
          transition: 'all 200ms ease-in-out',
          zIndex: 1
        }}
      >
        <Grid
          container
          item
          sx={{
            backgroundColor: theme.palette.grey[700],
            height: 200,
            p: 2,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5
          }}
        >
          <Grid item container>
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
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            <Grid item sx={{ width: 500, pl: 4, pr: 4 }}>
              <Slider
                value={temperature}
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
              <RadioGroup
                row
                value={documentRetrievalType}
                onChange={handleRadioChange}
              >
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
        </Grid>
      </Grid>
    </>
  );
};

export default SettingsSlider;
