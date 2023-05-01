import { ReactNode } from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/system';

export interface DocumentContainerProps {
  children?: ReactNode;
}

export const DocumentContainer = ({ children }: DocumentContainerProps) => {
  const theme = useTheme();
  return (
    <Grid
      container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        p: 1,
        flexWrap: 'nowrap',
        minWidth: 200,
        justifyContent: 'center',
        backgroundColor: theme.palette.grey[800]
      }}
    >
      {children}
    </Grid>
  );
};
