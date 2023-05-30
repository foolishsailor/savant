import {
  Dialog,
  DialogContent,
  Grid,
  List,
  ListItem,
  Box,
  Typography,
  IconButton,
  ListItemButton,
  useTheme,
  Tab,
  Tabs
} from '@mui/material';
import {
  ModalContentContainer,
  ContentContainer
} from '../containers/container.elements';
import { setDocumentLightBoxIsOpen } from '../../store/documentsSlice';
import { useState, useEffect, SetStateAction } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { Document } from '../../types/documents';
import Markdown from '../markdown';
import CloseIcon from '@mui/icons-material/Close';

const DocumentLightBox = () => {
  const theme = useTheme();
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
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: SetStateAction<number>
  ) => {
    setSelectedTab(newValue);
  };

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
          <ModalContentContainer sx={{ flexDirection: 'column' }}>
            <Tabs value={selectedTab} onChange={handleTabChange}>
              <Tab label="Document Content" />
              <Tab label="Document Metadata" />
            </Tabs>
            <Grid
              sx={{
                width: '100%',
                overflow: 'auto',
                display: 'flex',

                backgroundColor: theme.palette.grey[900]
              }}
            >
              {selectedTab === 0 && (
                <Grid
                  item
                  container
                  sx={{
                    flex: 1,
                    padding: theme.spacing(1)
                  }}
                >
                  <Markdown
                    message={
                      selectedDocumentPiece?.document ||
                      'Select a document to view its content.'
                    }
                  />
                </Grid>
              )}
              {selectedTab === 1 && (
                <Grid
                  item
                  container
                  sx={{
                    backgroundColor: theme.palette.grey[900],
                    padding: theme.spacing(1)
                  }}
                >
                  <Markdown
                    message={
                      '```json\n' +
                      JSON.stringify(selectedDocumentPiece?.metadata, null, 4) +
                      '\n```'
                    }
                  />
                </Grid>
              )}
            </Grid>
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
