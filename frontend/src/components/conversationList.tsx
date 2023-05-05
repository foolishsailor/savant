import { useState } from 'react';
import {
  Grid,
  useTheme,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import { Message } from '../types/message';
import Markdown from './markdown';
import { AiOutlineRobot } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';
import RevisionTabs from './revisionTabs';

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
      {messages.map((message, index) => {
        return (
          <Grid
            key={index}
            sx={{
              backgroundColor:
                message.source === 'assistant'
                  ? theme.palette.grey[700]
                  : theme.palette.grey[800],
              borderBottom: `${theme.palette.grey[900]} 1px solid`,
              width: '100%',
              pt: 2,
              pb: 2,
              pl: 10,
              pr: 10,
              boxShadow: 1,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Grid sx={{ alignSelf: 'flex-start' }}>
              {message.source === 'assistant' ? (
                <Avatar
                  sx={{
                    backgroundColor: 'transparent',
                    color: theme.palette.grey[200],
                    marginRight: 2
                  }}
                >
                  <AiOutlineRobot style={{ fontSize: 24 }} />
                </Avatar>
              ) : (
                <Avatar
                  sx={{
                    backgroundColor: 'transparent',
                    color: theme.palette.grey[200],
                    marginRight: 2
                  }}
                >
                  <BsPerson style={{ fontSize: 24 }} />
                </Avatar>
              )}
            </Grid>
            <Grid>
              <Typography component="div" variant="body1">
                {message.content.length > 1 ? (
                  <RevisionTabs tabs={message.content} />
                ) : (
                  <Markdown message={message.content[0]} />
                )}
              </Typography>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ConversationList;
