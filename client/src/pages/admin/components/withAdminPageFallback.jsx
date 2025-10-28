import React from "react";
import { AdminPageLoader, AdminPageError } from "./AdminPageLoader";

export function withAdminPageFallback(WrappedComponent, fetchFnName = "fetchData") {
  return function FallbackWrapper(props) {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const ref = React.useRef();

    React.useEffect(() => {
      if (ref.current && typeof ref.current[fetchFnName] === "function") {
        ref.current[fetchFnName]();
      }
    }, []);

    // These props must be set by the wrapped component
    const fallbackProps = {
      loading,
      setLoading,
      error,
      setError,
      ref,
    };

    if (loading) return <AdminPageLoader />;
    if (error) return <AdminPageError error={error} onRetry={() => ref.current[fetchFnName]()} />;
    return <WrappedComponent {...props} {...fallbackProps} />;
  };
}
