// src/components/SingleInputDropDown.tsx
import React, { useState } from 'react';
import {
  Grid,
  Typography,
  IconButton,
  TextField,
  FormHelperText,
  FormControl,
  CircularProgress,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';

interface SingleInputDropDownProps {
  title: string;
  handleAddCollection: (collectionName: string) => void;
}

const SingleInputDropDown: React.FC<SingleInputDropDownProps> = ({
  title,
  handleAddCollection
}) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const openSlider = () => {
    setIsOpen(!isOpen);
  };

  const closeSlider = () => {
    setInputValue('');
    setIsOpen(false);
    setIsInvalid(false);
  };

  const handleSave = () => {
    setLoading(true);
    handleAddCollection(inputValue);
    setLoading(false);
    closeSlider();
  };

  function handleInputChange(event: { target: { value: any } }) {
    const value = event.target.value;
    const isValid =
      /^[a-zA-Z0-9](?!.*\\.\\.)[a-zA-Z0-9_-]{1,61}[a-zA-Z0-9]$/.test(value);

    setInputValue(value);
    setIsInvalid(!isValid);
  }

  return (
    <Grid container direction="column" sx={{ position: 'relative' }}>
      <Grid
        item
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{
          borderBottom: `solid 1px ${theme.palette.grey[700]}`,
          backgroundColor: theme.palette.grey[900],
          zIndex: 2,
          pb: 1
        }}
      >
        <Grid item>
          <Typography>{title}</Typography>
        </Grid>
        <Grid item>
          <IconButton onClick={openSlider}>
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          flexWrap: 'nowrap',
          position: 'absolute',
          transform: isOpen ? 'translateY(50px)' : 'translateY(0px)',
          transition: 'transform 200ms',
          backgroundColor: theme.palette.grey[900],
          zIndex: 1
        }}
      >
        <Grid item sx={{ flex: 1 }}>
          <FormControl sx={{ display: 'flex' }}>
            <TextField
              label="Collection Name"
              variant="standard"
              value={inputValue}
              onChange={handleInputChange}
              inputProps={{
                pattern:
                  '^[a-zA-Z0-9](?!.*\\.\\.)[a-zA-Z0-9_-]{1,61}[a-zA-Z0-9]$',
                title:
                  'Expected collection name that (1) contains 3-63 characters, (2) starts and ends with an alphanumeric character, (3) otherwise contains only alphanumeric characters, underscores or hyphens (-), (4) contains no two consecutive periods (..) and (5) is not a valid IPv4 address'
              }}
              fullWidth
            />
            {isInvalid && (
              <FormHelperText sx={{ color: theme.palette.error.dark }}>
                Please enter a valid collection name that meets the requirements{' '}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item>
          <Grid item>
            <IconButton
              onClick={closeSlider}
              size="small"
              disabled={loading}
              sx={{ p: 0 }}
            >
              <CancelIcon fontSize="small" />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              onClick={handleSave}
              size="small"
              disabled={isInvalid || loading || inputValue.trim() === ''}
              sx={{ p: 0 }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <CheckIcon fontSize="small" />
              )}
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SingleInputDropDown;
