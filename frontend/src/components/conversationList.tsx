import { Grid, useTheme, Typography } from '@mui/material';
import { Message } from '../types/message';
import Markdown from './markdown';
interface Props {
  messages: Message[];
}

const ConversationList = ({ messages }: Props) => {
  const theme = useTheme();

  return (
    <Grid
      sx={{
        width: '100%',
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'column',
        height: '100%',

        overflowY: 'auto'
      }}
    >
      {messages.map((message, index) => (
        <Grid
          key={index}
          sx={{
            alignSelf:
              message.source === 'assistant' ? 'flex-end' : 'flex-start',
            backgroundColor:
              message.source === 'assistant'
                ? theme.palette.grey[800]
                : theme.palette.primary.dark,
            borderRadius: 3,
            width: '75%',
            pl: 2,
            pr: 2,
            m: 1,
            boxShadow: 1
          }}
        >
          <Typography>**Revising...**</Typography>
          <Markdown message={message.content} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ConversationList;
