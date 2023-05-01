import { useRef, useState } from 'react';
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
  const [documentsToUpload, setDocumentsToUpload] = useState<any[]>([]);
  const [documentsUploaded, setDocumentsUploaded] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setDocumentsToUpload(data);
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
      setDocumentsToUpload(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    documentsToUpload.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:4000/addDocuments', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        console.log('Files uploaded successfully');
      } else {
        console.error('Error uploading files');
      }
    } catch (error) {
      console.error('Error uploading files', error);
    }

    setDocumentsToUpload([]);
  };

  const handleFileInputChange = () => {
    if (fileInputRef.current && fileInputRef.current.files) {
      const newDocuments = Array.from(fileInputRef.current.files);
      setDocumentsToUpload([...documentsToUpload, ...newDocuments]);
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
        {documentsToUpload.map((doc, index) => (
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
        onClick={handleUpload}
      >
        Add Document
        <input
          type="file"
          hidden
          multiple
          ref={fileInputRef}
          onChange={handleFileInputChange}
        />
      </Button>
    </Grid>
  );
};

export default DocumentsList;
