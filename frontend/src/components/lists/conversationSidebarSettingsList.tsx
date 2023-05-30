import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { SidebarItem } from '../containers/container.elements';

export const ConversationSidebarSettingsList = () => {
  const onClearConversationClick = () => {};

  return (
    <SidebarItem sx={{ flex: 'unset' }}>
      <List>
        <ListItem onClick={onClearConversationClick}>
          <ListItemIcon>
            <DeleteForeverIcon />
          </ListItemIcon>
          <ListItemText primary="Clear conversations" />
        </ListItem>
      </List>
    </SidebarItem>
  );
};
