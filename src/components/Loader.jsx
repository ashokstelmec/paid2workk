// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// loader style
const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 80,
  left: 0,
  zIndex: 2001,
  width: '100%',
 
}));

// ==============================|| Loader ||============================== //

const Loader = () => (
  <LoaderWrapper>
    <LinearProgress sx={{ height: 2, backgroundColor: '#0b64fc' }} />
  </LoaderWrapper>
);

export default Loader;
