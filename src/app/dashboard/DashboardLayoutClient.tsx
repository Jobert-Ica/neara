"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Search,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/projects", label: "My Projects", icon: FolderOpen },
  { href: "/browse", label: "Find Professionals", icon: Search },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export default function DashboardLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              background: "linear-gradient(135deg, #2563EB, #60A5FA)",
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontWeight: 900, fontSize: 16 }}>N</span>
          </div>
          <span style={{ color: "white", fontWeight: 800, fontSize: 18, letterSpacing: "-0.3px" }}>
            NEARA
          </span>
        </Link>
        <div
          style={{
            marginTop: 8,
            padding: "4px 8px",
            background: "rgba(37,99,235,0.1)",
            border: "1px solid rgba(37,99,235,0.2)",
            borderRadius: 6,
            display: "inline-block",
          }}
        >
          <span style={{ color: "#93C5FD", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>
            CLIENT DASHBOARD
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{ textDecoration: "none" }}
            >
              <div
                className={`nav-item ${active ? "nav-item-active" : ""}`}
                style={{ marginBottom: 4 }}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {active && (
                  <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.5 }} />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div
        style={{
          padding: 16,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.03)",
            marginBottom: 8,
          }}
        >
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)" }}
            />
          ) : (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(37,99,235,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#60A5FA",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              {user.name[0].toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "white", fontSize: 13, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.name}
            </p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            borderRadius: 10,
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.35)",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
            transition: "all 150ms ease",
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#F87171"; (e.target as HTMLElement).style.background = "rgba(244,63,94,0.08)"; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.35)"; (e.target as HTMLElement).style.background = "transparent"; }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--background)" }}>
      {/* Desktop sidebar */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: "var(--background-secondary)",
          borderRight: "1px solid var(--border-strong)",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 40,
        }}
        className="dashboard-sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                zIndex: 50,
              }}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{
                width: 240,
                background: "var(--background-secondary)",
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                zIndex: 60,
              }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile header */}
      <div
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          background: "var(--background)",
          borderBottom: "1px solid var(--border-strong)",
          backdropFilter: "blur(12px)",
          zIndex: 30,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
        className="dashboard-mobile-header"
      >
        <button
          onClick={() => setMobileOpen(true)}
          style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: 4 }}
        >
          <Menu size={22} />
        </button>
        <span style={{ color: "white", fontWeight: 800, fontSize: 16, letterSpacing: "-0.3px" }}>
          NEARA
        </span>
        <div style={{ width: 30 }} />
      </div>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          marginLeft: 240,
          minHeight: "100vh",
          background: "var(--background)",
        }}
        className="dashboard-main"
      >
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-sidebar { display: none !important; }
          .dashboard-mobile-header { display: flex !important; }
          .dashboard-main { margin-left: 0 !important; padding-top: 56px; }
        }
      `}</style>
    </div>
  );
}
