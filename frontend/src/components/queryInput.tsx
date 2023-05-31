import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { TextField, Grid, useTheme, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import StopIcon from '@mui/icons-material/Stop';

import { Message } from '../types/message';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { useDispatch } from 'react-redux';
import { setConversation as setConversationState } from 'store/conversationSlice';

const socket = io('http://localhost:4000');

const QueryInput = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  let abortController: AbortController | undefined = undefined;
  const [reader, setReader] = useState<
    ReadableStreamDefaultReader<Uint8Array> | undefined
  >();

  const [isStreaming, setIsStreaming] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const model = useSelector((state: RootState) => state.conversation.model);
  const systemPrompt = useSelector(
    (state: RootState) => state.conversation.systemPrompt
  );
  const temperature = useSelector(
    (state: RootState) => state.conversation.temperature
  );
  const documentRetrievalType = useSelector(
    (state: RootState) => state.conversation.documentRetrievalType
  );

  const selectedCollection = useSelector(
    (state: RootState) => state.documents.selectedCollection
  );

  const [inputText, setInputText] = useState('');

  const {
    REACT_APP_CHAIN_END_TRIGGER_MESSAGE,
    REACT_APP_CHAT_END_TRIGGER_MESSAGE,
    REACT_APP_LLM_START_TRIGGER_MESSAGE
  } = process.env;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  useEffect(() => {
    dispatch(setConversationState(conversation));
  }, [conversation]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // prevent newline from being entered
      queryDocuments();
    }
  };

  const stopRequest = async () => {
    console.log('aborting request');
    abortController?.abort();
    await reader?.cancel();
    setReader(undefined);
    setIsStreaming(false);
  };

  const queryDocuments = async () => {
    abortController = new AbortController();
    let questionText = inputText;
    let updatedConversation = [...conversation];
    if (!inputText) {
      const lastUserMessage = updatedConversation
        .slice()
        .reverse()
        .find((message) => message.source === 'user');
      if (lastUserMessage) {
        questionText = lastUserMessage.content.join();
        updatedConversation = updatedConversation.slice(0, -2);
      }
    }

    setConversation(updatedConversation);

    setConversation((prev) => [
      ...prev,
      { source: 'user', content: [questionText] }
    ]);
    setConversation((prev) => [
      ...prev,
      { source: 'assistant', content: [''] }
    ]);
    setInputText('');

    socket.emit('query_documents', {
      question: questionText,
      systemPrompt,
      queryType: documentRetrievalType,
      temperature,
      collectionName: selectedCollection.name,
      model
    });

    setIsStreaming(true);
  };

  // Function to process the stream
  socket.on('query_document_stream', (data) => {
    const decodedChunk = data;

    if (decodedChunk === REACT_APP_CHAT_END_TRIGGER_MESSAGE) {
      setIsStreaming(false);
      return;
    }

    if (
      REACT_APP_CHAIN_END_TRIGGER_MESSAGE &&
      REACT_APP_LLM_START_TRIGGER_MESSAGE
    )
      setConversation((prev) => {
        const commandFilteredOut = decodedChunk
          .split(REACT_APP_CHAIN_END_TRIGGER_MESSAGE)
          .join('')
          .split(REACT_APP_LLM_START_TRIGGER_MESSAGE)
          .join('');

        const lastElementIndex = prev.length - 1;

        const updatedAssistantMessage: Message = {
          source: 'assistant',
          content: [...prev[lastElementIndex].content]
        };

        if (decodedChunk === REACT_APP_CHAIN_END_TRIGGER_MESSAGE) {
          updatedAssistantMessage.content.push(' ');
        } else if (decodedChunk === REACT_APP_LLM_START_TRIGGER_MESSAGE) {
          const lastIndexInContentArray =
            updatedAssistantMessage.content.length - 1;

          updatedAssistantMessage.content[lastIndexInContentArray] += '\n\n';
        } else {
          const lastIndexInContentArray =
            updatedAssistantMessage.content.length - 1;

          updatedAssistantMessage.content[lastIndexInContentArray] +=
            commandFilteredOut;
        }

        const newConversation = [...prev];
        newConversation[lastElementIndex] = updatedAssistantMessage;
        return newConversation;
      });
  });

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Grid
      item
      container
      rowGap={2}
      sx={{
        p: 2,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        position: 'relative',
        justifyContent: 'flex-end',
        height: 140,
        boxShadow: '0px -8px 30px 2px rgba(33,33,33, 0.6)'
      }}
    >
      {(conversation.length > 0 || isStreaming) && (
        <Grid container sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Button
            onClick={isStreaming ? () => stopRequest() : queryDocuments}
            variant="outlined"
            startIcon={isStreaming ? <StopIcon /> : <RefreshIcon />}
            sx={{
              borderColor: theme.palette.grey[700],
              color: theme.palette.grey[400],
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.grey[800],
                borderColor: theme.palette.grey[700],
                color: theme.palette.grey[400]
              }
            }}
          >
            {isStreaming ? 'Stop generating' : 'Regenerate response'}
          </Button>
        </Grid>
      )}
      <Grid
        sx={{
          pl: 8,
          pr: 8
        }}
      >
        <TextField
          label="Query Documents"
          value={inputText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          multiline
          maxRows={4}
          fullWidth
          InputProps={{
            style: {
              color: theme.palette.grey[100],
              height: '100%',
              alignItems: 'flex-start'
            }
          }}
          sx={{
            label: { color: theme.palette.grey[500] },
            resize: 'vertical'
          }}
        />
      </Grid>
    </Grid>
  );
};

export default React.memo(QueryInput);
