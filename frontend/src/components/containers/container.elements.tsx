import { Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SidebarContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  flexWrap: 'nowrap',
  minWidth: 200,
  backgroundColor: theme.palette.grey[900],
  justifyContent: 'center',
  '& > :not(:last-child)': {
    borderBottom: `solid 1px ${theme.palette.grey[700]}`
  }
}));

export const SidebarItem = styled(Grid)(({ theme }) => ({
  p: 1,
  flex: 1,
  flexDirection: 'column',
  flexWrap: 'nowrap',
  justifyContent: 'center',
  padding: theme.spacing(1)
}));

export const ContentContainer = styled(Grid)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  gap: theme.spacing(1)
}));

export const ConversationContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  flex: 5,
  overFlow: 'auto',
  maxHeight: 'calc(100vh - 360px)',
  display: 'flex'
}));
