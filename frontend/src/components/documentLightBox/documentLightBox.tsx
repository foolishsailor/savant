import {
  Dialog,
  DialogContent,
  Grid,
  List,
  ListItem,
  Box,
  Typography,
  IconButton,
  ListItemButton
} from '@mui/material';
import {
  ModalContentContainer,
  ContentContainer
} from '../containers/container.elements';
import { setDocumentLightBoxIsOpen } from '../../store/documentsSlice';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { Document } from '../../types/documents';
import Markdown from '../markdown';
import CloseIcon from '@mui/icons-material/Close';

const DocumentLightBox = () => {
  const dispatch = useDispatch();
  const selectedDocument = useSelector(
    (state: RootState) => state.documents.selectedDocument
  );
  const documents = useSelector(
    (state: RootState) => state.documents.documents
  );
  const documentLightBoxIsOpen = useSelector(
    (state: RootState) => state.documents.documentLightBoxIsOpen
  );

  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [selectedDocumentPiece, setSelectedDocumentPiece] =
    useState<Document | null>(null);

  useEffect(() => {
    if (selectedDocument) {
      if (documents && documents[selectedDocument]) {
        setSelectedDocuments(documents[selectedDocument]);
        setSelectedDocumentPiece(documents[selectedDocument][0]); // Select the first document by default
      }
    }
  }, [selectedDocument, documents]);

  const handleClose = () => {
    setSelectedDocumentPiece(null);
    dispatch(setDocumentLightBoxIsOpen(false));
  };

  return (
    <Dialog
      open={documentLightBoxIsOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="xl"
    >
      <DialogContent>
        <Grid item>
          <Typography variant="h5" component="h2" gutterBottom>
            {selectedDocument}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
        <ContentContainer>
          <ModalContentContainer>
            <Box
              sx={{
                height: '100%',
                width: '100%',
                overflow: 'auto'
              }}
            >
              <Markdown
                message={
                  selectedDocumentPiece?.document ||
                  'Select a document to view its content.'
                }
              />
            </Box>
          </ModalContentContainer>
          <Grid item>
            <List>
              {selectedDocuments &&
                selectedDocuments.map((document, idx) => (
                  <ListItemButton
                    key={idx}
                    onClick={() => setSelectedDocumentPiece(document)}
                    selected={selectedDocumentPiece === document}
                  >
                    {idx}
                  </ListItemButton>
                ))}
            </List>
          </Grid>
        </ContentContainer>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentLightBox;
