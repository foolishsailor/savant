import React, { useState } from 'react';
import { Container } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { QueryContainer } from './components/queryContainer';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { PageContainer } from './components/pageContainer';
import { DocumentContainer } from './components/documentContainer';
import { ConversationContainer } from './components/conversationContainer';
import QueryInput from './components/queryInput';
import DocumentsList from './components/documentList';
const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

const App: React.FC = () => {
  const [response, setResponse] = useState('');

  const responseHandler = (response: string) => {
    setResponse(response);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{}}>
        <PageContainer>
          <QueryContainer>
            <ConversationContainer>
              <ReactMarkdown>{response}</ReactMarkdown>
            </ConversationContainer>
            <QueryInput onResponse={responseHandler} />
          </QueryContainer>
          <DocumentContainer>
            <DocumentsList />
          </DocumentContainer>
        </PageContainer>
      </Container>
    </ThemeProvider>
  );
};

export default App;
