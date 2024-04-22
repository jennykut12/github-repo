import React from "react";

const ErrorHandling = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>OOPS!!!</p>
      <p>Something went wrong:</p>
      <pre className=" text-gray-200">{error.message}</pre>
    </div>
  );
};

export default ErrorHandling;

