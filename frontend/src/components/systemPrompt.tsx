import { TextField } from '@mui/material';

import { useDispatch } from 'react-redux';
import { setSystemPrompt } from 'store/conversationSlice';

const SystemPrompt = () => {
  const dispatch = useDispatch();

  const systemPromptHandler = (prompt: string) => {
    dispatch(setSystemPrompt(prompt));
  };

  return (
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
  );
};

export default SystemPrompt;
