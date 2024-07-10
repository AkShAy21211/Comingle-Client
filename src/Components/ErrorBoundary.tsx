// components/ErrorBoundary.tsx

import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-4">Error: {error.message}</p>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={resetErrorBoundary}
        >
          Try again
        </button>
      </div>
    </div>
  );
};

const CustomErrorBoundary = ({ children }:{children:ReactNode}) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state or perform any necessary actions
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default CustomErrorBoundary;
