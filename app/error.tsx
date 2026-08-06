"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-3xl font-display font-bold text-primary-900 mb-2">Something went wrong!</h2>
      <p className="text-primary-600 max-w-md mx-auto mb-8">
        We hit an unexpected error while loading this page. Please try again or return home.
      </p>
      <button
        onClick={() => reset()}
        className="bg-primary-900 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-800 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
