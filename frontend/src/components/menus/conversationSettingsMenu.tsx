import { styled, useTheme } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Toolbar,
  Fab,
  IconButton,
  Grid,
  Drawer,
  Menu,
  MenuItem
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import Settings from '@mui/icons-material/Settings';
import SettingsSlider from 'components/sliders/settingSlider';
import { useState } from 'react';
import useModelService from 'services/apiService/useModelService';

const ConversationSettingsMenu = () => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const { getModels } = useModelService();

  const toggleSettings = () => {
    setIsOpen(!isOpen);
  };

  const handleGetModels = async () => {
    const models = await getModels();
    console.log(models);
  };

  return (
    <Grid
      sx={{
        top: 'auto',
        bottom: 0,
        position: 'relative'
      }}
    >
      <Toolbar sx={{ zIndex: 5, backgroundColor: theme.palette.grey[800] }}>
        <Box sx={{ flexGrow: 1 }} />

        <IconButton onClick={handleGetModels} color="inherit">
          models
        </IconButton>
        <IconButton onClick={toggleSettings} color="inherit">
          <Settings />
        </IconButton>
      </Toolbar>
      <SettingsSlider isOpen={isOpen} />
    </Grid>
  );
};

export default ConversationSettingsMenu;
