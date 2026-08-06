"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Critical Application Error</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">{error.message}</p>
          <button
            onClick={() => reset()}
            className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
