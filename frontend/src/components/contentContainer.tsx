import { ReactNode } from 'react';
import { Grid } from '@mui/material';

export interface PageContainerProps {
  children?: ReactNode;
}

export const ContentContainer = ({ children }: PageContainerProps) => {
  return (
    <Grid
      container
      columnGap={1}
      sx={{
        flex: 1,
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
