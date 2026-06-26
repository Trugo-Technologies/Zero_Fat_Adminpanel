import { Theme, styled } from '@mui/material/styles';

interface IOwnerState {
  active: boolean;
  completed: boolean;
}
type InputProps = {
  theme?: Theme;
  ownerState: IOwnerState;
};

export const ColorLibStepIconRoot = styled('div')<InputProps>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState?.active && {
    backgroundColor: '#a5d060',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundColor: '#a5d060',
  }),
}));
