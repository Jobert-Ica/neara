import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | NEARA",
  description: "Learn more about NEARA, the premier platform connecting clients with verified construction professionals in the Philippines.",
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#060d1f" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "140px 24px 80px", color: "white" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h1 style={{ fontSize: 52, fontWeight: 800, marginBottom: 24, background: "linear-gradient(to right, #ffffff, #9ca3af)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-1px" }}>
              About NEARA
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", maxWidth: 650, margin: "0 auto" }}>
              NEARA is a trusted platform designed to bridge the gap between clients and verified construction professionals in the Philippines. Whether you are building your dream home, renovating a commercial space, or looking for specialized engineering services, we make it easy to find the right experts.
            </p>
          </div>

          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 80 }}>
            <div style={{ background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: 24, padding: 40, transition: "transform 0.3s ease" }} className="hover-lift">
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 24 }}>🎯</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: "white" }}>Our Mission</h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.6)" }}>
                To empower Filipinos to build better by connecting them with highly skilled, verified professionals, ensuring quality, safety, and transparency in every construction and design project.
              </p>
            </div>
            <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 24, padding: 40, transition: "transform 0.3s ease" }} className="hover-lift">
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 24 }}>👁️</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: "white" }}>Our Vision</h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.6)" }}>
                To be the leading and most trusted digital marketplace for the construction and architecture industry in the Philippines, fostering a culture of excellence and reliability.
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, textAlign: "center" }}>Why Choose Us?</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { title: "Verified Professionals", desc: "Every professional undergoes a strict verification process, including PRC license checks, to ensure you are working with qualified experts.", icon: "🛡️" },
              { title: "Seamless Connections", desc: "Easily search, filter, and contact professionals based on your specific project needs, location, and budget.", icon: "🤝" },
              { title: "Transparent Reviews", desc: "Read genuine feedback and ratings from past clients to make informed decisions before hiring a professional.", icon: "⭐" },
              { title: "Dedicated Support", desc: "Our team is always ready to assist you throughout your journey, from finding the right professional to project completion.", icon: "💬" }
            ].map((item, i) => (
              <li key={i} style={{ display: "flex", gap: 24, alignItems: "flex-start", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: 32, borderRadius: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{item.title}</h4>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, marginTop: 80, textAlign: "center" }}>Meet Team JORAX</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", textAlign: "center", marginBottom: 48, maxWidth: 600, margin: "0 auto 48px" }}>
            The dedicated professionals behind the scenes who built and maintain the NEARA platform.
          </p>
          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { role: "Frontend Engineer", emoji: "💻", desc: "Crafting beautiful and responsive user interfaces." },
              { role: "Backend Engineer", emoji: "⚙️", desc: "Building robust APIs and secure server logic." },
              { role: "UI/UX Designer", emoji: "🎨", desc: "Designing intuitive user flows and sleek aesthetics." },
              { role: "Database Administrator", emoji: "🗄️", desc: "Ensuring data integrity and high-performance queries." },
              { role: "QA Specialist", emoji: "🔍", desc: "Testing thoroughly to eliminate bugs and glitches." },
              { role: "DevOps Engineer", emoji: "🚀", desc: "Managing cloud infrastructure and seamless deployments." },
            ].map((member, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: 24, borderRadius: 20, textAlign: "center", transition: "transform 0.3s ease", display: "flex", flexDirection: "column", alignItems: "center" }} className="hover-lift">
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 16 }}>
                  {member.emoji}
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{member.role}</h4>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: 0 }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <style>{`
        .hover-lift:hover {
          transform: translateY(-4px);
        }
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
          .team-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
