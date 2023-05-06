import React, { useState } from 'react';
import { Container } from '@mui/material';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { PageContainer } from './components/containers/pageContainer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppBarComponent from './components/appBar';
import { ContentContainer } from './components/containers/container.elements';
import DocumentSideBar from './components/documentSideBar';
import Conversation from './components/conversation';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

const App: React.FC = () => {
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
          <AppBarComponent />
          <ContentContainer>
            <Conversation />
            <DocumentSideBar />
          </ContentContainer>
        </PageContainer>
      </Container>
    </ThemeProvider>
  );
};

export default App;
