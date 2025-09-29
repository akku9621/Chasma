import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "../app/ClientLayout";
import { AppProviders } from "../app/providers"; // ✅ i18n + context

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JYOTI NETRA SEVA & JYOTI CHASHMA SAGAR",
  description:
    "JYOTI NETRA SEVA & JYOTI CHASHMA SAGAR's trusted opticians & eye care. Premium frames, trendy eyewear, and personalized service.",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google + external fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;700&family=Quicksand:wght@400;600&family=Raleway:wght@400;700&family=Nunito+Sans:wght@400;700&family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Bootstrap + FontAwesome */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        {/* ✅ Wrap everything with AppProviders (i18n + context) */}
        <AppProviders>
          <ClientLayout>{children}</ClientLayout>
        </AppProviders>

        {/* Bootstrap JS */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
