import { BadgeCheck, User, ShieldCheck } from "lucide-react";

interface AuthenticityProps {
  isHandloom: boolean;
  giTag: boolean;
  weaverName: string | null;
  certification: string | null;
}

export default function AuthenticityBadges({ isHandloom, giTag, weaverName, certification }: AuthenticityProps) {
  if (!isHandloom) return null;

  return (
    <div className="bg-secondary-light border border-secondary p-4 rounded-xl flex flex-col gap-3 my-6">
      <h4 className="text-sm font-bold text-primary-900 uppercase tracking-wider mb-1">Authenticity Guaranteed</h4>
      
      {giTag && (
        <div className="flex items-center gap-3">
          <BadgeCheck className="text-accent w-5 h-5 shrink-0" />
          <p className="text-sm text-primary-800">
            <span className="font-semibold">GI Tagged:</span> Authentic geographical indication.
          </p>
        </div>
      )}
      
      {weaverName && (
        <div className="flex items-center gap-3">
          <User className="text-accent w-5 h-5 shrink-0" />
          <p className="text-sm text-primary-800">
            <span className="font-semibold">Artisan:</span> Crafted by {weaverName}.
          </p>
        </div>
      )}
      
      {certification && (
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-accent w-5 h-5 shrink-0" />
          <p className="text-sm text-primary-800">
            <span className="font-semibold">Certified:</span> {certification}.
          </p>
        </div>
      )}
    </div>
  );
}
