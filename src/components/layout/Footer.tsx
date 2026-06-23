import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

const FOOTER_LINKS = {
  Platform: [
    { label: "Browse Professionals", href: "/browse" },
    { label: "Post a Project", href: "/dashboard/projects/new" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
  ],
  Professionals: [
    { label: "Join as Professional", href: "/sign-in?type=professional" },
    { label: "Buy Credits", href: "/credits" },
    { label: "Verification Guide", href: "/verification" },
    { label: "Professional Dashboard", href: "/dashboard" },
  ],
  Company: [
    { label: "About NEARA", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const PROFESSIONS = [
  "Architects",
  "Civil Engineers",
  "Structural Engineers",
  "Electrical Engineers",
  "Mechanical Engineers",
  "Contractors",
  "Interior Designers",
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#060d1f",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: 64,
        paddingBottom: 32,
      }}
    >
      <div className="container">
        {/* Top section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 48,
            marginBottom: 64,
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: "span 2" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "white", fontWeight: 900, fontSize: 16 }}>N</span>
              </div>
              <span style={{ color: "white", fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px" }}>NEARA</span>
            </Link>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, maxWidth: 300, marginBottom: 24 }}>
              Helping clients find trusted professionals while helping professionals acquire qualified project opportunities.
            </p>

            {/* Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={14} />, text: "Philippines" },
                { icon: <Mail size={14} />, text: "hello@neara.ph" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {/* Social mapping removed to fix icon imports */}
            </div>
          </div>

          {/* Nav sections */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 style={{ color: "white", fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16, marginTop: 0 }}>
                {category}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, textDecoration: "none", transition: "color 150ms ease" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Profession tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            padding: "24px 0",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            marginBottom: 32,
          }}
        >
          {PROFESSIONS.map((p) => (
            <Link
              key={p}
              href={`/browse?profession=${p.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                background: "rgba(37,99,235,0.08)",
                border: "1px solid rgba(37,99,235,0.16)",
                color: "#60A5FA",
                fontSize: 12,
                fontWeight: 500,
                textDecoration: "none",
                transition: "all 150ms ease",
              }}
            >
              {p}
            </Link>
          ))}
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, margin: 0 }}>
            © {new Date().getFullYear()} NEARA. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Sitemap", href: "/sitemap.xml" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, textDecoration: "none" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
