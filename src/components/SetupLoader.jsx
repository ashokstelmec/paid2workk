// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// loader style
const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 10,
  width: '100%',
  '& > * + *': {
    marginTop: theme.spacing(2)
  }
}));

// ==============================|| Loader ||============================== //

const SetupLoader = () => (
  <LoaderWrapper>
    <LinearProgress sx={{ height: 2, backgroundColor: '#0b64fc' }} />
  </LoaderWrapper>
);

export default SetupLoader;
