import { styled, useTheme } from '@mui/material/styles';
import {
  IconButton,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton
} from '@mui/material';

import ScatterPlotOutlinedIcon from '@mui/icons-material/ScatterPlotOutlined';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import Settings from '@mui/icons-material/Settings';
import ConversationSettingsDrawer from 'components/drawers/conversationSettingDrawer';
import { useState } from 'react';
import useModelService from 'services/apiService/useModelService';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemLabel
} from 'components/menus/menu.elements';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { setModel } from 'store/conversationSlice';
import ConversationTemperature from 'components/slider/conversationTemperature';
import DocumentQueryRadio from 'components/radio/documentQueryRadio';

const ConversationSettingsMenu = () => {
  const dispatch = useDispatch();
  const documentRetrievalType = useSelector(
    (state: RootState) => state.conversation.documentRetrievalType
  );
  const temperature = useSelector(
    (state: RootState) => state.conversation.temperature
  );
  const model = useSelector((state: RootState) => state.conversation.model);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [models, setModels] = useState<string[]>([]);

  const { getModels } = useModelService();

  const toggleSettings = (item: string) => {
    if (selectedItem === item) {
      setSelectedItem(null);
      return;
    }
    setSelectedItem(item);
  };

  const handleModels = async () => {
    if (selectedItem === 'model') return setSelectedItem(null);

    const models = await getModels();
    setModels(models);
    toggleSettings('model');
    console.log(models);
  };

  const handleModelSelection = (event: any) => {
    const model = event.currentTarget.textContent;
    dispatch(setModel(model));
    setSelectedItem(null);
  };

  return (
    <Menu size="sm">
      <MenuContent>
        <Grid
          container
          item
          sx={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <MenuItem onClick={handleModels}>
            <ScatterPlotOutlinedIcon />
            <MenuItemLabel>{model}</MenuItemLabel>
          </MenuItem>
          <MenuItem onClick={() => toggleSettings('temperature')}>
            <ThermostatIcon />
            <MenuItemLabel>{temperature}</MenuItemLabel>
          </MenuItem>
          <MenuItem onClick={() => toggleSettings('retrievalType')}>
            <FindInPageIcon />
            <MenuItemLabel>{documentRetrievalType}</MenuItemLabel>
          </MenuItem>
        </Grid>
      </MenuContent>
      <ConversationSettingsDrawer isOpen={selectedItem === 'model'}>
        <List>
          {models.map((model, index) => (
            <ListItemButton key={index} onClick={handleModelSelection}>
              <ListItemText primary={model} />
            </ListItemButton>
          ))}
        </List>
      </ConversationSettingsDrawer>
      <ConversationSettingsDrawer isOpen={selectedItem === 'retrievalType'}>
        <DocumentQueryRadio />
      </ConversationSettingsDrawer>
      <ConversationSettingsDrawer isOpen={selectedItem === 'temperature'}>
        <ConversationTemperature />
      </ConversationSettingsDrawer>
    </Menu>
  );
};

export default ConversationSettingsMenu;
