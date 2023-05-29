import React, { useEffect, useState } from 'react';
import { TextField, Grid, useTheme, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import StopIcon from '@mui/icons-material/Stop';

import { Message } from '../types/message';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { useDispatch } from 'react-redux';
import { setConversation as setConversationState } from 'store/conversationSlice';

const QueryInput = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
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

  const { REACT_APP_CHAIN_END_TRIGGER_MESSAGE } = process.env;

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

  const queryDocuments = async () => {
    setConversation((prev) => [
      ...prev,
      { source: 'user', content: [inputText] }
    ]);
    setConversation((prev) => [
      ...prev,
      { source: 'assistant', content: [''] }
    ]);
    setInputText('');

    setIsStreaming(true);

    try {
      const result = await fetch('http://localhost:4000/collections/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: inputText,
          systemPrompt,
          queryType: documentRetrievalType,
          temperature,
          collectionName: selectedCollection.name,
          model
        })
      });

      if (!result.ok) {
        setIsStreaming(false);
        throw new Error(`HTTP error, status code: ${result.status}`);
      }
      // Read the response body as a stream
      const reader = result.body?.getReader();

      // Function to process the stream
      const readStream = async () => {
        if (reader) {
          try {
            const { done, value } = await reader.read();

            if (done) {
              console.log('done----------');
              setIsStreaming(false);
              return;
            }

            // Decode the received chunk and add it to the receivedData string
            const decodedChunk = new TextDecoder().decode(value);

            if (REACT_APP_CHAIN_END_TRIGGER_MESSAGE)
              setConversation((prev) => {
                const commandFilteredOut = decodedChunk
                  .split(REACT_APP_CHAIN_END_TRIGGER_MESSAGE)
                  .join('');

                const lastElementIndex = prev.length - 1;

                const updatedAssistantMessage: Message = {
                  source: 'assistant',
                  content: [...prev[lastElementIndex].content]
                };

                if (decodedChunk === REACT_APP_CHAIN_END_TRIGGER_MESSAGE) {
                  updatedAssistantMessage.content.push(' ');
                } else {
                  const lastIndexInContentArray =
                    updatedAssistantMessage.content.length - 1;
                  updatedAssistantMessage.content[lastIndexInContentArray] =
                    updatedAssistantMessage.content[lastIndexInContentArray] +
                    commandFilteredOut;
                }

                const newConversation = [...prev];
                newConversation[lastElementIndex] = updatedAssistantMessage;
                return newConversation;
              });

            // Continue reading the stream
            await readStream();
          } catch (error) {
            setIsStreaming(false);
            toast.error('Failed query documents');
            return;
          }
        }
      };

      // Start reading the stream
      await readStream();
    } catch (error) {
      setIsStreaming(false);
      toast.error('Failed query documents');
      return;
    }
  };

  return (
    <Grid
      item
      container
      rowGap={1}
      sx={{
        p: 2,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        position: 'relative',
        justifyContent: 'flex-end',
        height: 140
      }}
    >
      {(conversation.length > 0 || isStreaming) && (
        <Grid container sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Button
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
