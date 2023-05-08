import React from 'react';
import { Provider } from 'react-redux';
import { Container } from '@mui/material';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import store from './store';

import { PageContainer } from './components/containers/container.elements';
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
      <Provider store={store}>
        <Container maxWidth="xl" sx={{ height: 300, maxHeight: '100vh' }}>
          <PageContainer>
            <AppBarComponent />
            <ContentContainer>
              <Conversation />
              <DocumentSideBar />
            </ContentContainer>
          </PageContainer>
        </Container>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
