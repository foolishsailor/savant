import { ReactNode } from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/system';

export interface ConversationContainerProps {
  children?: ReactNode;
}

export const ConversationContainer = ({
  children
}: ConversationContainerProps) => {
  const theme = useTheme();
  return (
    <Grid
      container
      sx={{
        backgroundColor: theme.palette.grey[900],

        flex: 5,
        overFlow: 'auto',
        maxHeight: 'calc(100vh - 360px)',
        display: 'flex'
      }}
    >
      {children}
    </Grid>
  );
};
