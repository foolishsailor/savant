import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { SidebarItem } from '../containers/container.elements';

export const DocumentSidebarSettingsList = () => {
  const onClearDocumentsClick = () => {};
  const onClearConversationClick = () => {};

  return (
    <SidebarItem sx={{ flex: 'unset' }}>
      <List>
        <ListItem onClick={onClearConversationClick}>
          <ListItemIcon>
            <DeleteForeverIcon />
          </ListItemIcon>
          <ListItemText primary="Clear collections" />
        </ListItem>
        <ListItem onClick={onClearDocumentsClick}>
          <ListItemIcon>
            <DeleteSweepIcon />
          </ListItemIcon>
          <ListItemText primary="Clear documents" />
        </ListItem>
      </List>
    </SidebarItem>
  );
};
