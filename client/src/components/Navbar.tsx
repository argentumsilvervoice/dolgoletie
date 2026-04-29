import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };
  return (
    <button onClick={toggle} aria-label="Переключить тему" className="p-2 rounded-md hover:bg-secondary transition-colors" data-testid="theme-toggle">
      {dark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const { subscriber, logout } = useAuth();
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background) / 0.96)", backdropFilter: "blur(12px)" }}>
      <div className="container-main flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 select-none">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-label="Основы долголетия" role="img">
            <rect width="36" height="36" rx="8" fill="var(--color-garnet)" />
            <text x="18" y="25" fontSize="20" textAnchor="middle" fill="#f7f4ee" fontFamily="Cormorant Garamond, Georgia, serif" fontWeight="600">Д</text>
          </svg>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 600, letterSpacing: "0.01em", lineHeight: 1.2 }}>
            Основы<br /><span style={{ color: "var(--color-garnet)" }}>долголетия</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button onClick={() => scrollTo("about")} className="hover:text-primary transition-colors" style={{ color: "var(--color-text-muted)" }}>О журнале</button>
          <button onClick={() => scrollTo("subscribe")} className="hover:text-primary transition-colors" style={{ color: "var(--color-text-muted)" }}>Подписка</button>
          <button onClick={() => scrollTo("expert")} className="hover:text-primary transition-colors" style={{ color: "var(--color-text-muted)" }}>Эксперт</button>
          {subscriber ? (
            <>
              <Link href="/cabinet" className="btn-outline py-2 px-4 text-sm">Личный кабинет</Link>
              <button onClick={logout} className="text-sm hover:opacity-70 transition-opacity" style={{ color: "var(--color-text-muted)" }}>Выйти</button>
            </>
          ) : (
            <button onClick={() => scrollTo("subscribe")} className="btn-primary py-2 px-5">Подписаться</button>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-md" aria-label="Меню" data-testid="mobile-menu-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></> : <><path d="M4 12h16"/><path d="M4 6h16"/><path d="M4 18h16"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t py-4 px-6 flex flex-col gap-4" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}>
          <button onClick={() => scrollTo("about")} className="text-left text-sm font-medium">О журнале</button>
          <button onClick={() => scrollTo("subscribe")} className="text-left text-sm font-medium">Подписка</button>
          <button onClick={() => scrollTo("expert")} className="text-left text-sm font-medium">Эксперт</button>
          {subscriber ? (
            <>
              <Link href="/cabinet" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Личный кабинет</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-sm" style={{ color: "var(--color-text-muted)" }}>Выйти</button>
            </>
          ) : (
            <button onClick={() => scrollTo("subscribe")} className="btn-primary text-center">Подписаться</button>
          )}
        </div>
      )}
    </header>
  );
}
