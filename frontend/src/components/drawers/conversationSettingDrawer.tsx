import { ReactNode } from 'react';
import { Grid, useTheme } from '@mui/material';

const ConversationSettingsDrawer = ({
  isOpen,
  children
}: {
  isOpen: boolean;
  children: ReactNode;
}) => {
  const theme = useTheme();

  return (
    <Grid
      container
      sx={{
        bottom: isOpen ? 40 : -200,
        padding: theme.spacing(2),
        position: 'absolute',
        transition: 'all 200ms ease-in-out',
        backgroundColor: theme.palette.grey[800],
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {children}
    </Grid>
  );
};

export default ConversationSettingsDrawer;
