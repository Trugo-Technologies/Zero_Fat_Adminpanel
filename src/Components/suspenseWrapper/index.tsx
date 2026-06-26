import { Suspense } from "react";
import Loader from "../loader";
import ErrorBoundary from "../error/error-boundary";
const SuspenseWrapper = (Component: () => JSX.Element) => (props: any) => {
  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default SuspenseWrapper;
