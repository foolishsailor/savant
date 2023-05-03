import { ReactNode } from 'react';
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useTheme } from '@mui/system';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export interface SettingContainerProps {}

export const SettingContainer = () => {
  const theme = useTheme();
  const onSettingsClick = () => {};
  const onClearDocumentsClick = () => {};
  const onClearConversationClick = () => {};

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        flexDirection: 'column',

        flexWrap: 'nowrap',
        minWidth: 200,
        justifyContent: 'center',
        borderTop: `solid 1px ${theme.palette.grey[600]}`
      }}
    >
      <List>
        <ListItem onClick={onClearConversationClick}>
          <ListItemIcon>
            <DeleteForeverIcon />
          </ListItemIcon>
          <ListItemText primary="Clear conversation" />
        </ListItem>
        <ListItem onClick={onClearDocumentsClick}>
          <ListItemIcon>
            <DeleteSweepIcon />
          </ListItemIcon>
          <ListItemText primary="Clear documents" />
        </ListItem>
        <ListItem onClick={onSettingsClick}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Grid>
  );
};
