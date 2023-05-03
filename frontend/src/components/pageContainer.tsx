import { ReactNode } from 'react';
import { Box, Grid } from '@mui/material';

export interface PageContainerProps {
  children?: ReactNode;
}

export const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <Grid
      container
      columnGap={1}
      sx={{
        minHeight: '100vh',
        maxHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap'
      }}
    >
      {children}
    </Grid>
  );
};
