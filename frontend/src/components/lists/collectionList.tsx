import { useEffect, useState } from 'react';
import {
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/system';

import { SidebarItem } from 'components/containers/container.elements';
import { toast } from 'react-toastify';

import SingleInputDropDown from 'components/dropdowns/singleInputDropDown';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store';
import {
  setDocuments,
  setSelectedCollection,
  setCollections
} from 'store/documentsSlice';

import useCollectionService from 'services/apiService/useCollectionService';
import useDocumentService from 'services/apiService/useDocumentService';

const CollectionsList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { addCollection, deleteCollection, getCollections } =
    useCollectionService();

  const { getDocuments } = useDocumentService();

  const selectedCollection = useSelector(
    (state: RootState) => state.documents.selectedCollection
  );

  const collections = useSelector(
    (state: RootState) => state.documents.collections
  );

  const handleAddCollection = (collectionName: string) => {
    addCollection(collectionName)
      .then((data) => {
        dispatch(setCollections(data));
      })
      .catch((error) => {
        toast.error('Failed to add collection: ' + error);
      });
  };

  const handleDeleteCollection = (index: number) => {
    const collection = collections[index];
    deleteCollection(collection.name)
      .then((data) => {
        dispatch(setCollections(data));
      })
      .catch((error) => {
        toast.error('Failed to delete documents: ' + error);
      });
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getCollections();
        dispatch(setCollections(data));

        if (data.length > 0) {
          dispatch(setSelectedCollection(data[0]));
        }
      } catch (error) {
        toast.error('Failed to get collections: ' + error);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedCollection?.name)
      getDocuments(selectedCollection.name)
        .then((data) => {
          dispatch(setDocuments(data));
        })
        .catch((error) => {
          toast.error('Failed to get documents: ' + error);
        });
  }, [selectedCollection]);

  return (
    <SidebarItem sx={{ overflow: 'auto' }}>
      <SingleInputDropDown
        title={'collections'}
        handleAddCollection={handleAddCollection}
      />
      <List sx={{ flex: 1 }}>
        {collections.map((collection, index) => (
          <ListItemButton
            key={index}
            onClick={() => dispatch(setSelectedCollection(collection))}
            sx={{
              cursor: 'pointer',
              backgroundColor:
                selectedCollection?.name === collection.name
                  ? theme.palette.action.selected
                  : 'transparent'
            }}
          >
            <ListItemText primary={collection.name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteCollection(index)}
              >
                <Grid sx={{ ml: 1 }}>
                  <DeleteIcon />
                </Grid>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItemButton>
        ))}
      </List>
    </SidebarItem>
  );
};

export default CollectionsList;
