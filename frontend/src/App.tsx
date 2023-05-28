import React from 'react';
import { Provider } from 'react-redux';
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import store from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppBarComponent from './components/appBar';
import {
  PageContainer,
  ContentContainer
} from './components/containers/container.elements';
import DocumentSideBar from './components/documentSideBar';
import Conversation from './components/conversation';
import DocumentLightBox from './components/documentLightBox';
import { initializeApp } from 'firebase/app';

import { AuthProvider } from 'providers/authProvider';
import { firebaseConfig } from 'services/authService';
import ConversationSideBar from 'components/conversationSideBar';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

export const firebaseApp = initializeApp(firebaseConfig);

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
        <AuthProvider>
          <DocumentLightBox />
          <PageContainer>
            <ContentContainer>
              <ConversationSideBar />
              <Conversation />
              <DocumentSideBar />
            </ContentContainer>
          </PageContainer>
        </AuthProvider>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
