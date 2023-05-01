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
import UploadModal from './uploadModal';
import FileIcon from './fileIcon';

const DocumentsList = () => {
  const [documentsUploaded, setDocumentsUploaded] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const documentsUploadHandler = (documents: string[]) => {
    setDocumentsUploaded(documents);
  };

  const deleteDocument = async (index: number) => {
    try {
      const result = await fetch(
        `http://localhost:4000/deleteDocument/${index}`,
        { method: 'DELETE' }
      );
      const data = await result.json();
      setDocumentsUploaded(data);
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
        {documentsUploaded.map((doc, index) => (
          <ListItem key={index}>
            <Grid sx={{ mr: 1 }}>
              <FileIcon fileName={doc} />
            </Grid>
            <ListItemText primary={doc} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteDocument(index)}
              >
                <Grid sx={{ ml: 1 }}>
                  <DeleteIcon />
                </Grid>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        component="label"
        onClick={() => setOpen(true)}
      >
        Add Document
      </Button>
      <UploadModal
        open={open}
        onClose={handleClose}
        onUploadDocuments={documentsUploadHandler}
      />
    </Grid>
  );
};

export default DocumentsList;
