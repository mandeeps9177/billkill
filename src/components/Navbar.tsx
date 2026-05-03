"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plane, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#DADCE0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center group-hover:bg-[#1558B0] transition-colors">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-[#202124]">
              Bill<span className="text-[#1A73E8]">kill</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <Link href="/dashboard" className={`text-sm px-3 py-2 rounded-full transition-all ${pathname === "/dashboard" ? "text-[#1A73E8] bg-[#E8F0FE] font-medium" : "text-[#5F6368] hover:text-[#202124] hover:bg-[#F1F3F4]"}`}>Dashboard</Link>
                <Link href="/book" className={`text-sm px-3 py-2 rounded-full transition-all ${pathname === "/book" ? "text-[#1A73E8] bg-[#E8F0FE] font-medium" : "text-[#5F6368] hover:text-[#202124] hover:bg-[#F1F3F4]"}`}>Book trip</Link>
              </>
            ) : (
              <>
                <Link href="/#how-it-works" className="text-sm text-[#5F6368] hover:text-[#202124] px-3 py-2 rounded-full hover:bg-[#F1F3F4] transition-all">How it works</Link>
                <Link href="/#savings" className="text-sm text-[#5F6368] hover:text-[#202124] px-3 py-2 rounded-full hover:bg-[#F1F3F4] transition-all">Savings</Link>
                <Link href="/#safety" className="text-sm text-[#5F6368] hover:text-[#202124] px-3 py-2 rounded-full hover:bg-[#F1F3F4] transition-all">Safety</Link>
              </>
            )}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F1F3F4]">
                  <div className="w-7 h-7 rounded-full bg-[#1A73E8] flex items-center justify-center text-white text-xs font-semibold">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-[#202124]">{user.name.split(" ")[0]}</span>
                </div>
                <button onClick={handleLogout} className="text-sm text-[#80868B] hover:text-[#D93025] px-2 py-2 rounded-full hover:bg-[#FCE8E6] transition-all" title="Sign out">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
                <Link href="/login" className="btn-primary text-sm">Get started</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-full hover:bg-[#F1F3F4]">
            {open ? <X className="w-5 h-5 text-[#5F6368]" /> : <Menu className="w-5 h-5 text-[#5F6368]" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#DADCE0] px-4 py-3 flex flex-col gap-1">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-3 mb-1">
                <div className="w-9 h-9 rounded-full bg-[#1A73E8] flex items-center justify-center text-white text-sm font-semibold">{initials}</div>
                <div>
                  <p className="text-sm font-semibold text-[#202124]">{user.name}</p>
                  <p className="text-xs text-[#80868B]">+91 {user.phone}</p>
                </div>
              </div>
              <Link href="/dashboard" className="text-sm text-[#5F6368] px-3 py-2.5 rounded-xl hover:bg-[#F1F3F4]" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link href="/book" className="text-sm text-[#5F6368] px-3 py-2.5 rounded-xl hover:bg-[#F1F3F4]" onClick={() => setOpen(false)}>Book trip</Link>
              <div className="border-t border-[#E8EAED] mt-2 pt-2">
                <button onClick={() => { handleLogout(); setOpen(false); }} className="text-sm text-[#D93025] w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#FCE8E6]">Sign out</button>
              </div>
            </>
          ) : (
            <>
              <Link href="/#how-it-works" className="text-sm text-[#5F6368] px-3 py-2.5 rounded-xl hover:bg-[#F1F3F4]" onClick={() => setOpen(false)}>How it works</Link>
              <Link href="/#savings" className="text-sm text-[#5F6368] px-3 py-2.5 rounded-xl hover:bg-[#F1F3F4]" onClick={() => setOpen(false)}>Savings</Link>
              <div className="border-t border-[#DADCE0] mt-2 pt-2 flex flex-col gap-2">
                <Link href="/login" className="text-sm text-center text-[#1A73E8] font-medium px-3 py-2.5 rounded-xl hover:bg-[#E8F0FE]" onClick={() => setOpen(false)}>Sign in</Link>
                <Link href="/login" className="btn-primary text-sm text-center" onClick={() => setOpen(false)}>Get started</Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
