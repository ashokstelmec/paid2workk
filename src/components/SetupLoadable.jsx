import { Suspense } from 'react';

// project-imports
import Loader from './SetupLoader';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const SetupLoadable = (Component) => (props) =>
  (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );

export default SetupLoadable;
