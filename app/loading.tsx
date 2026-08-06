import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
      <h2 className="text-xl font-display font-semibold text-primary-900">Loading...</h2>
      <p className="text-primary-500 mt-2 text-sm">Please wait while we fetch the latest styles.</p>
    </div>
  );
}
