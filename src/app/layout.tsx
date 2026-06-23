import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppProviders } from "@/components/providers/AppProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NEARA — Find Trusted Professionals",
    template: "%s | NEARA",
  },
  description:
    "NEARA connects clients with verified architects, engineers, contractors, and designers in the Philippines. Find trusted professionals for your construction and design projects.",
  keywords: [
    "architect Philippines",
    "civil engineer",
    "contractor Philippines",
    "interior designer",
    "structural engineer",
    "construction professional",
    "find architect",
    "NEARA",
  ],
  authors: [{ name: "NEARA" }],
  creator: "NEARA",
  publisher: "NEARA",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://neara.ph"
  ),
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://neara.ph",
    siteName: "NEARA",
    title: "NEARA — Find Trusted Professionals",
    description:
      "Connect with verified architects, engineers, contractors, and designers in the Philippines.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NEARA — Professional Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEARA — Find Trusted Professionals",
    description:
      "Connect with verified architects, engineers, contractors, and designers in the Philippines.",
    images: ["/og-image.png"],
    creator: "@nearaph",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  let initialNotifications: any[] = [];

  if (user) {
    initialNotifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        {/* Microsoft Clarity */}
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
              `,
            }}
          />
        )}
      </head>
      <body className={`${inter.variable} antialiased`}>
        <AppProviders userId={user?.id} initialNotifications={initialNotifications}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
