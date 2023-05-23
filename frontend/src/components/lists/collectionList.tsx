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

import { SidebarItem } from '../containers/container.elements';
import { toast } from 'react-toastify';

import SingleInputDropDown from '../dropdowns/singleInputDropDown';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  setDocuments,
  setSelectedCollection,
  setCollections
} from '../../store/documentsSlice';

const CollectionsList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const selectedCollection = useSelector(
    (state: RootState) => state.documents.selectedCollection
  );

  const collections = useSelector(
    (state: RootState) => state.documents.collections
  );

  const handleAddCollection = async (collectionName: string) => {
    try {
      const result = await fetch(
        `http://localhost:4000/collections?collectionName=${collectionName}`
      );

      const data = await result.json();

      if (data.error) {
        throw new Error(data.error);
      }

      dispatch(setCollections([...collections, ...data]));

      const documents = data[0];

      dispatch(setSelectedCollection(documents));
    } catch (error) {
      console.error(error);
      toast.error('Failed to add collection: ' + error);
    }
  };

  const deleteCollection = async (index: number) => {
    try {
      const collection = collections[index];
      const result = await fetch(
        `http://localhost:4000/collections/${collection.name}`,
        { method: 'DELETE' }
      );
      const data = await result.json();

      if (data.error) {
        throw new Error(data.error);
      }

      dispatch(setCollections(data));
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete documents: ' + error);
    }
  };

  useEffect(() => {
    const getCollections = async () => {
      try {
        const result = await fetch('http://localhost:4000/collections');
        const data = await result.json();

        dispatch(setCollections(data));

        if (data.length > 0) {
          dispatch(setSelectedCollection(data[0]));
        }
      } catch (error) {
        console.error(error);
      }
    };
    getCollections();
  }, []);

  useEffect(() => {
    const setCollection = async () => {
      try {
        await fetch(
          `http://localhost:4000/collections?collectionName=${selectedCollection?.name}`
        );
        const result = await fetch(
          `http://localhost:4000/documents?collectionName=${selectedCollection?.name}`
        );
        const data = await result.json();

        if (data.error) {
          throw new Error(data.error);
        }

        dispatch(setDocuments(data));
      } catch (error) {
        console.error(error);
        toast.error('Failed to get documents: ' + error);
      }
    };

    if (selectedCollection?.name) setCollection();
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
                onClick={() => deleteCollection(index)}
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
