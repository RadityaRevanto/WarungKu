import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Review", href: "#Review" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/images/navbar/Logo WarungKu.png"
            alt="Logo WarungKu"
            width={360}
            height={360}
            priority
            className="h-12 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-10 text-sm font-medium text-slate-500 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-slate-600 transition-colors hover:text-violet-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button className="rounded-full bg-[#6A34F5] px-6 py-2 text-sm font-semibold text-white shadow-sm shadow-[#6A34F5]/30 transition hover:bg-[#5825d6]">
          Login
        </button>
      </div>
    </header>
  );
}
