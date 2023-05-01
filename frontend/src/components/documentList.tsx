import { useState } from 'react';
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const DocumentsList = () => {
  const [documents, setDocuments] = useState<any[]>([]);

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

  return (
    <Grid
      item
      container
      rowGap={1}
      sx={{
        pt: 2,
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        height: '100%'
      }}
    >
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
      <Button variant="contained" startIcon={<AddIcon />} component="label">
        Add Document
        <input
          type="file"
          hidden
          onChange={(e) => e.target.files && addDocument(e.target.files[0])}
        />
      </Button>
    </Grid>
  );
};

export default DocumentsList;
