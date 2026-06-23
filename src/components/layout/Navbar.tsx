"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Menu, X, Bell, ChevronDown, LogOut, User, Settings, LayoutDashboard, Briefcase } from "lucide-react";
import { useNotifications } from "@/components/providers/NotificationProvider";

const NAV_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Safe notification hook consumption (in case it's used outside provider occasionally)
  let unreadCount = 0;
  try {
    const notifs = useNotifications();
    unreadCount = notifs.unreadCount;
  } catch (e) {
    // ignore
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardHref =
    (session?.user as any)?.role === "ADMIN"
      ? "/admin/dashboard"
      : (session?.user as any)?.role === "PROFESSIONAL"
      ? "/dashboard"
      : "/dashboard";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 250ms ease",
        padding: "0 24px",
        height: "68px",
        display: "flex",
        alignItems: "center",
        background: isScrolled
          ? "rgba(6,13,31,0.92)"
          : "transparent",
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        borderBottom: isScrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #2563EB, #60A5FA)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontWeight: 900, fontSize: 14, letterSpacing: "-1px" }}>N</span>
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "white",
            }}
          >
            NEARA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
          className="hidden-mobile"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                color:
                  pathname === link.href
                    ? "#60A5FA"
                    : "rgba(255,255,255,0.7)",
                background:
                  pathname === link.href
                    ? "rgba(37,99,235,0.1)"
                    : "transparent",
                transition: "all 150ms ease",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {session?.user ? (
            <>
              {/* Notifications */}
              <Link
                href="/notifications"
                style={{
                  position: "relative",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.7)",
                  transition: "all 150ms ease",
                  textDecoration: "none",
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 8,
                      width: 8,
                      height: 8,
                      background: "#EF4444",
                      borderRadius: "50%",
                      boxShadow: "0 0 0 2px rgba(6,13,31,0.92)",
                    }}
                  />
                )}
              </Link>

              {/* User menu */}
              <div style={{ position: "relative" }}>
                <button
                  id="user-menu-trigger"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 12px 6px 6px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                    color: "white",
                    transition: "all 150ms ease",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "white",
                      overflow: "hidden",
                    }}
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || ""}
                        width={28}
                        height={28}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      session.user.name?.[0]?.toUpperCase() || "U"
                    )}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    {session.user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: userMenuOpen ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 150ms ease",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  />
                </button>

                {userMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: "#0f1b3d",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                      padding: "8px",
                      minWidth: 200,
                      boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                      zIndex: 100,
                    }}
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div style={{ padding: "8px 12px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>
                      <p style={{ color: "white", fontWeight: 600, fontSize: 14, margin: 0 }}>{session.user.name}</p>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: "2px 0 0" }}>{session.user.email}</p>
                    </div>

                    {[
                      { icon: <LayoutDashboard size={15} />, label: "Dashboard", href: dashboardHref },
                      { icon: <User size={15} />, label: "Profile", href: (session.user as any).role === "PROFESSIONAL" ? "/profile" : "/settings" },
                      { icon: <Settings size={15} />, label: "Settings", href: "/settings" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "9px 12px",
                          borderRadius: 8,
                          color: "rgba(255,255,255,0.7)",
                          textDecoration: "none",
                          fontSize: 14,
                          transition: "all 150ms ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                          (e.currentTarget as HTMLElement).style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                          (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}

                    <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />

                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false); }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 12px",
                        borderRadius: 8,
                        color: "#f87171",
                        background: "transparent",
                        border: "none",
                        width: "100%",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 500,
                        transition: "all 150ms ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(244,63,94,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/sign-in"
              id="sign-in-btn"
              style={{
                padding: "9px 20px",
                borderRadius: 10,
                background: "#2563EB",
                color: "white",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                transition: "all 150ms ease",
                border: "1px solid #2563EB",
              }}
            >
              Get Started
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "white",
              cursor: "pointer",
            }}
            className="show-mobile"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: 68,
            left: 0,
            right: 0,
            background: "rgba(6,13,31,0.98)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "16px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            zIndex: 49,
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 500,
                textDecoration: "none",
                color:
                  pathname === link.href ? "#60A5FA" : "rgba(255,255,255,0.7)",
                background:
                  pathname === link.href
                    ? "rgba(37,99,235,0.1)"
                    : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
          {!session?.user && (
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              style={{
                marginTop: 12,
                padding: "13px 20px",
                borderRadius: 10,
                background: "#2563EB",
                color: "white",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Get Started
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
