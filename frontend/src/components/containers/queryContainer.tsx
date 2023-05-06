import { ReactNode } from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/system';

export interface QueryContainerProps {
  children?: ReactNode;
}

export const QueryContainer = ({ children }: QueryContainerProps) => {
  const theme = useTheme();
  return (
    <Grid
      container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 4,
        p: 1,
        flexWrap: 'nowrap',
        minWidth: 200,
        justifyContent: 'center',
        backgroundColor: theme.palette.grey[900]
      }}
    >
      {children}
    </Grid>
  );
};
