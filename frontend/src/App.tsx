import React, { useState } from 'react';
import { Container } from '@mui/material';
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
import ConversationList from './components/conversationList';
import { Message } from './types/message';
import { SettingContainer } from './components/settingContainer';
import { SidebarContainer } from './components/sidebarContainer';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

const App: React.FC = () => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [systemPrompt, setSystemPrompt] = useState<string>('');

  const responseHandler = (response: Message) => {
    setConversation((prev) => [...prev, response]);
  };

  const systemPromptHandler = (prompt: string) => {
    setSystemPrompt(prompt);
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
      <Container maxWidth="xl" sx={{ height: 300, maxHeight: '100vh' }}>
        <PageContainer>
          <QueryContainer>
            <Header onUpdateSystemPrompt={systemPromptHandler} />
            <ConversationContainer>
              <ConversationList messages={conversation} />
            </ConversationContainer>
            <QueryInput
              addResponse={setConversation}
              systemPrompt={systemPrompt}
            />
          </QueryContainer>
          <SidebarContainer>
            <DocumentContainer>
              <DocumentsList />
            </DocumentContainer>
            <SettingContainer />
          </SidebarContainer>
        </PageContainer>
      </Container>
    </ThemeProvider>
  );
};

export default App;
