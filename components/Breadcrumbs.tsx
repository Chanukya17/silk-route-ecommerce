import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center text-sm text-primary-600 mb-6">
      <Link href="/" className="hover:text-accent transition-colors">Home</Link>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-2 text-primary-400" />
          {index === items.length - 1 ? (
            <span className="text-primary-900 font-medium truncate max-w-[200px] md:max-w-md">
              {item.label}
            </span>
          ) : (
            <Link href={item.href} className="hover:text-accent transition-colors">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
