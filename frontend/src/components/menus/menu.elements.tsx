import { Grid, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Menu = styled(Grid)<{
  size?: 'sm' | 'lg'; // Define size as an optional prop
}>(({ theme, size }) => ({
  height: size === 'sm' ? 40 : 80,
  position: 'relative',
  borderTop: `1px solid ${theme.palette.grey[900]}`
}));

export const MenuContent = styled(Grid)(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  zIndex: 2,
  backgroundColor: theme.palette.grey[800],
  height: '100%'
}));

export const MenuItem = styled(Button)(({ theme, size }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  padding: theme.spacing(0, 1),
  gap: theme.spacing(1),
  fontSize: 14,
  color: 'white'
}));

export const MenuItemLabel = styled(Typography)(({ theme }) => ({
  fontSize: 'inherit',
  color: theme.palette.grey[400]
}));
