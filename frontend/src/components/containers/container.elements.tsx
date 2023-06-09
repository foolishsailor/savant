import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PageContainer = styled(Grid)(({ theme }) => ({
  minHeight: '100vh',
  maxHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  columnGap: theme.spacing(1)
}));

export const SidebarContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  flexWrap: 'nowrap',
  minWidth: 250,
  backgroundColor: theme.palette.background.paper,
  justifyContent: 'center',
  '& > :not(:last-child)': {
    borderBottom: `solid 1px ${theme.palette.grey[700]}`
  }
}));

export const SidebarItem = styled(Grid)(({ theme }) => ({
  display: 'flex',
  p: 1,
  flex: 1,
  flexDirection: 'column',
  flexWrap: 'nowrap',
  padding: theme.spacing(1)
}));

export const ContentContainer = styled(Grid)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'row',
  flexWrap: 'nowrap'
}));

export const ConversationContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  flex: 5,
  maxHeight: 'calc(100vh - 180px)',
  display: 'flex'
}));

export const ModalContentContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
  flex: 1,

  display: 'flex',
  height: 'calc(100vh - 160px)'
}));

export const QueryContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 4,
  p: 1,
  flexWrap: 'nowrap',
  minWidth: 200,
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[900],
  overflow: 'hidden'
}));
