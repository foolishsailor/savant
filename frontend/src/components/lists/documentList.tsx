import { useState } from 'react';
import {
  Grid,
  IconButton,
  List,
  ListItem as ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadModal from '../modals/uploadModal';
import FileIcon from '../fileIcon';
import { SidebarItem } from '../containers/container.elements';
import { DocumentsObject } from '../../types/documents';
import AddItemHeader from '../headers/addItemHeader';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  setDocuments,
  setSelectedDocument,
  setDocumentLightBoxIsOpen
} from '../../store/documentsSlice';

const DocumentsList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const selectedCollection = useSelector(
    (state: RootState) => state.documents.selectedCollection
  );
  const documents = useSelector(
    (state: RootState) => state.documents.documents
  );

  const [selectedDocumentListItem, setSelectedDocumentListItem] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const selectDocumentHandler = (documentName: string) => {
    dispatch(setSelectedDocument(documentName));
    dispatch(setDocumentLightBoxIsOpen(true));
    setSelectedDocumentListItem(documentName);
  };

  const documentsUploadHandler = (documents: DocumentsObject) => {
    if (selectedCollection && selectedCollection.name) {
      return dispatch(setDocuments(documents));
    }

    toast.error('Please select a collection');
  };

  const deleteDocument = async (document: string) => {
    if (!selectedCollection) {
      throw new Error('Please select a collection');
    }

    try {
      const result = await fetch(`http://localhost:4000/documents/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionName: selectedCollection.name,
          fileName: document
        })
      });
      const data = await result.json();

      if (data) dispatch(setDocuments(data));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SidebarItem>
      <AddItemHeader
        title="Documents"
        handleAddCollection={() => setOpen(true)}
      />
      <List
        sx={{ flex: 1, overflow: 'auto', maxHeight: `calc(100vh - 500px)` }}
      >
        {documents &&
          Object.keys(documents).map((document: string, index: number) => (
            <ListItemButton
              key={index}
              onClick={() => selectDocumentHandler(document)}
              sx={{
                cursor: 'pointer',
                backgroundColor:
                  selectedDocumentListItem === document
                    ? theme.palette.action.selected
                    : 'transparent'
              }}
            >
              <Grid sx={{ mr: 1 }}>
                <FileIcon fileName={document} />
              </Grid>
              <ListItemText primary={document} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteDocument(document)}
                >
                  <Grid sx={{ ml: 1 }}>
                    <DeleteIcon />
                  </Grid>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItemButton>
          ))}
      </List>

      <UploadModal
        selectedCollection={selectedCollection}
        open={open}
        onClose={handleClose}
        onUploadDocuments={documentsUploadHandler}
      />
    </SidebarItem>
  );
};

export default DocumentsList;
