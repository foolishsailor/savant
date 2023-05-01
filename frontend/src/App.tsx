import React, { useState } from 'react';
import {
  Container,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ReactMarkdown from 'react-markdown';
import { QueryContainer } from './components/queryContainer';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { PageContainer } from './components/pageContainer';
import { DocumentContainer } from './components/documentContainer';
import { ConversationContainer } from './components/conversationContainer';
import QueryInput from './components/queryInput';
const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

const App: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const addDocument = async (file: File) => {
    try {
      // Call the addDocuments API endpoint with the file
      // Replace this code with the correct implementation to handle file uploads
      const result = await fetch('http://localhost:4000/addDocuments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents: [file.name] })
      });
      const data = await result.json();
      setDocuments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDocument = async (index: number) => {
    try {
      const result = await fetch(
        `http://localhost:4000/deleteDocument/${index}`,
        { method: 'DELETE' }
      );
      const data = await result.json();
      setDocuments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const queryDocuments = async () => {
    try {
      const result = await fetch('http://localhost:4000/askQuestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query })
      });
      const data = await result.json();
      setResponse(data.response);
    } catch (error) {
      console.error(error);
    }
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
            <QueryInput />
          </QueryContainer>
          <DocumentContainer>
            <List>
              {documents.map((doc, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${doc.name} (${doc.type})`} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteDocument(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component="label"
            >
              Add Document
              <input
                type="file"
                hidden
                onChange={(e) =>
                  e.target.files && addDocument(e.target.files[0])
                }
              />
            </Button>
          </DocumentContainer>
        </PageContainer>
      </Container>
    </ThemeProvider>
  );
};

export default App;
