import { Grid, Typography, IconButton, useTheme } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

interface AddItemHeaderProps {
  title: string;
  handleAddCollection: () => void;
}

const AddItemHeader = ({ title, handleAddCollection }: AddItemHeaderProps) => {
  const theme = useTheme();
  return (
    <Grid
      item
      container
      alignItems="center"
      justifyContent="space-between"
      sx={{
        borderBottom: `solid 1px ${theme.palette.grey[700]}`,
        backgroundColor: theme.palette.background.paper,
        zIndex: 5,
        pb: 1
      }}
    >
      <Grid item>
        <Typography>{title}</Typography>
      </Grid>
      <Grid item>
        <IconButton onClick={handleAddCollection}>
          <AddIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default AddItemHeader;
