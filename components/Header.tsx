import Link from "next/link";
import CartIcon from "./CartIcon";
import UserDropdown from "./UserDropdown";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-secondary/20 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 lg:gap-6">
          <MobileMenu />
          <Link href="/" className="font-display text-xl md:text-2xl font-bold tracking-tight text-primary-800">
            SILK & WEAVE
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#" className="transition-colors hover:text-accent">New Arrivals</Link>
            <Link href="/type/handloom" className="transition-colors hover:text-accent">Handloom</Link>
            <Link href="/type/powerloom" className="transition-colors hover:text-accent">Powerloom</Link>
            <Link href="#" className="transition-colors hover:text-accent">Collections</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 flex-1 justify-end max-w-md ml-8">
          <SearchBar />
          <UserDropdown />
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
