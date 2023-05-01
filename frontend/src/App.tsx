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
import Header from './components/header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <CssBaseline />
      <Container maxWidth="xl" sx={{}}>
        <PageContainer>
          <QueryContainer>
            <Header />
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
