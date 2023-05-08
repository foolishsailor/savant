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
import { CollectionList } from '../../types/collection';
import { SidebarItem } from '../containers/container.elements';
import { toast } from 'react-toastify';
import { DocumentsObjectInterface } from '../../types/documents';
import SingleInputDropDown from '../dropdowns/singleInputDropDown';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  setDocuments,
  setSelectedCollection
} from '../../store/documentsSlice';

const CollectionsList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const selectedCollection = useSelector(
    (state: RootState) => state.documents.selectedCollection
  );

  const [collections, setCollections] = useState<CollectionList[]>([]);

  const handleAddCollection = async (collectionName: string) => {
    try {
      const result = await fetch(
        `http://localhost:4000/collections?collectionName=${collectionName}`
      );

      const data = await result.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setCollections((prevCollections) => [...prevCollections, ...data]);

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

      setCollections(data);
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

        setCollections(data);
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

        if (data[0]) dispatch(setDocuments(data[0]));
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
            selected={selectedCollection?.name === collection.name}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected
              },
              '&:hover': {
                cursor: 'pointer'
              }
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

      {/* <UploadModal
        open={open}
        onClose={handleClose}
        onUploadDocuments={documentsUploadHandler}
      /> */}
    </SidebarItem>
  );
};

export default CollectionsList;
