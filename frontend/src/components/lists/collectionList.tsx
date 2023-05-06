import { useEffect, useRef, useState } from 'react';
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
import UploadModal from '../modals/uploadModal';
import { useTheme } from '@mui/system';
import { CollectionList } from '../../types/collection';
import { SidebarItem } from '../containers/container.elements';

const DocumentsList = () => {
  const theme = useTheme();
  const [collections, setCollections] = useState<CollectionList[]>([]);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const deleteCollection = async (index: number) => {
    try {
      const result = await fetch(
        `http://localhost:4000/deleteDocument/${index}`,
        { method: 'DELETE' }
      );
      const data = await result.json();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getDocuments = async () => {
      try {
        const result = await fetch('http://localhost:4000/collections');
        const data = await result.json();
        setCollections(data);
      } catch (error) {
        console.error(error);
      }
    };
    getDocuments();
  }, []);

  return (
    <SidebarItem>
      <List>
        {collections.map((collection, index) => (
          <ListItem key={index}>
            <ListItemText primary={collection.name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteCollection(index)}
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
        fullWidth
      >
        Add Collection
      </Button>

      {/* <UploadModal
        open={open}
        onClose={handleClose}
        onUploadDocuments={documentsUploadHandler}
      /> */}
    </SidebarItem>
  );
};

export default DocumentsList;
