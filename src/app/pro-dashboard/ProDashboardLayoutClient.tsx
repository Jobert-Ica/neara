"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Inbox,
  UserCircle,
  CreditCard,
  Bell,
  MessageSquare,
  LogOut,
  Menu,
  ChevronRight,
  CheckCircle,
  Clock,
  Coins,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/pro-dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/pro-dashboard/requests", label: "Project Requests", icon: Inbox },
  { href: "/pro-dashboard/profile", label: "My Profile", icon: UserCircle },
  { href: "/pro-dashboard/credits", label: "Credits", icon: CreditCard },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  creditBalance: number;
  verificationStatus: string;
}

export default function ProDashboardLayoutClient({
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

  const isVerified = user.verificationStatus === "APPROVED";
  const isPending = user.verificationStatus === "PENDING";

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
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
          <span style={{ color: "white", fontWeight: 800, fontSize: 18, letterSpacing: "-0.3px" }}>NEARA</span>
        </Link>
        <div style={{ marginTop: 8, padding: "4px 8px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, display: "inline-block" }}>
          <span style={{ color: "#FCD34D", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>
            PRO DASHBOARD
          </span>
        </div>
      </div>

      {/* Credit balance */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.15)",
            borderRadius: 10,
          }}
        >
          <Coins size={16} style={{ color: "#F59E0B" }} />
          <div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, margin: 0, letterSpacing: "0.06em", textTransform: "uppercase" }}>Credits</p>
            <p style={{ color: "#FCD34D", fontSize: 18, fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
              {user.creditBalance}
            </p>
          </div>
          <Link href="/pro-dashboard/credits" style={{ marginLeft: "auto", color: "#F59E0B", textDecoration: "none", fontSize: 11, fontWeight: 700 }}>
            Buy →
          </Link>
        </div>

        {/* Verification status */}
        <div style={{ marginTop: 10 }}>
          {isVerified ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle size={13} style={{ color: "#34D399" }} />
              <span style={{ color: "#34D399", fontSize: 12, fontWeight: 600 }}>PRC Verified</span>
            </div>
          ) : isPending ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={13} style={{ color: "#FCD34D" }} />
              <span style={{ color: "#FCD34D", fontSize: 12, fontWeight: 600 }}>Verification Pending</span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#F87171", fontSize: 12, fontWeight: 600 }}>⚠️ Not Verified</span>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
              <div className={`nav-item ${active ? "nav-item-active" : ""}`} style={{ marginBottom: 4 }}>
                <item.icon size={18} />
                <span>{item.label}</span>
                {active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.5 }} />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.03)", marginBottom: 8 }}>
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)" }} />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#F59E0B", fontWeight: 700, fontSize: 15 }}>
              {user.name[0].toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "white", fontSize: 13, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: "transparent", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 150ms ease" }}
          onMouseEnter={(e) => { (e.currentTarget).style.color = "#F87171"; (e.currentTarget).style.background = "rgba(244,63,94,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget).style.color = "rgba(255,255,255,0.35)"; (e.currentTarget).style.background = "transparent"; }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#060d1f" }}>
      {/* Desktop sidebar */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: "rgba(255,255,255,0.02)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 40,
        }}
        className="pro-sidebar"
      >
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50 }} />
            <motion.aside initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} style={{ width: 240, background: "#0f1b3d", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 60 }}>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div style={{ display: "none", position: "fixed", top: 0, left: 0, right: 0, height: 56, background: "rgba(6,13,31,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", zIndex: 30, alignItems: "center", justifyContent: "space-between", padding: "0 20px" }} className="pro-mobile-header">
        <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: 4 }}>
          <Menu size={22} />
        </button>
        <span style={{ color: "white", fontWeight: 800, fontSize: 16, letterSpacing: "-0.3px" }}>NEARA Pro</span>
        <div style={{ width: 30 }} />
      </div>

      <main style={{ flex: 1, marginLeft: 240, minHeight: "100vh" }} className="pro-main">
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .pro-sidebar { display: none !important; }
          .pro-mobile-header { display: flex !important; }
          .pro-main { margin-left: 0 !important; padding-top: 56px; }
        }
      `}</style>
    </div>
  );
}
