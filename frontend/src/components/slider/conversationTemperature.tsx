import { Grid, Slider } from '@mui/material';

import { useSelector, useDispatch } from 'react-redux';
import { setTemperature } from 'store/conversationSlice';
import { RootState } from 'store';

const ConversationTemperature = () => {
  const dispatch = useDispatch();
  const temperature = useSelector(
    (state: RootState) => state.conversation.temperature
  );

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    dispatch(setTemperature(newValue as number));
  };

  return (
    <Grid
      item
      sx={{
        justifyContent: 'center',
        width: 400,
        pl: 4,
        pr: 4
      }}
    >
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
  );
};

export default ConversationTemperature;
